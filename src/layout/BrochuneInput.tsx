"use client"
import { Button, Col, Flex, Form, Image, Input, Row, Spin, Tabs, Upload, message } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import type { TabsProps, UploadProps, GetProp } from 'antd';
import React from "react";
import ReactQuill from "react-quill";
import html2pdf from "html2pdf.js";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const BrochuneInput = () => {

    const [selectedFile, setSelectedFile] = React.useState("")
    const [selectedTab, setSelectedTab] = React.useState("1")
    const [loading, setLoading] = React.useState(false)
    const ReactQuillRef = React.useRef(null as any)
    const [state, seState] = React.useState({
        content: "",
        role: ""
    })


    const onFinish = async (values: any) => {
        console.log('Success:', values);
        if (process.env.NODE_ENV == "development") {
            seState({
                content: `<img src=${selectedFile}/><p>Once upon a time, in a small village nestled in the heart of the countryside, there lived a young girl named Lily. She was known for her boundless curiosity and adventurous spirit, always seeking new experiences and uncovering hidden treasures. One sunny afternoon, as Lily was exploring the nearby enchanted forest, she stumbled upon a magical pathway she had never seen before. The path was covered in vibrant flowers and twinkling lights, enticing her to take a step into the unknown. Intrigued by the path's allure, Lily bravely ventured down the mysterious trail. As she walked, the air seemed to shimmer with a magical energy, and the chirping of birds grew louder, as if guiding her along the way. After what seemed like hours of wandering, Lily stumbled upon a quaint cottage nestled among towering trees. Its walls were adorned with ivy, and a warm light poured from its windows. The sound of rustling leaves emanated from inside, beckoning her closer. Cautiously, Lily approached the door and gently pushed it open. To her astonishment, the cottage was filled with a bustling community of woodland creatures. Rabbits, squirrels, and even birds were busy preparing for a grand celebration. In the middle of the room stood a wise old owl named Oliver, the keeper of the enchanted forest. He explained that the celebration was to honor the arrival of spring, and Lily was the honored guest. The animals had been waiting for a brave and adventurous human to join their festivities. Overwhelmed with excitement, Lily joined in the joyous celebrations. The animals sang, danced, and feasted on delectable treats. Lily's heart swelled with gratitude, realizing she had found a place where she truly belonged. As the night sky scattered with radiant stars, Oliver revealed the true purpose of the enchanted forest. It served as a bridge between the human world and the magical realm, where dreams and wishes could come true for those with pure hearts. From that day forward, Lily became the guardian of the enchanted forest. She helped foster harmony between humans and magical creatures, ensuring that the bond between the two worlds remained strong. Years passed, and stories of the enchanted forest and its courageous guardian spread far and wide. The village grew prosperous, and people from all walks of life sought the guidance and wisdom that Lily and the forest offered. Lily's extraordinary journey had transformed her from an ordinary girl into a revered legend, reminding everyone that the true magic lies in embracing adventure, spreading love, and finding one's place in the world. And so, the enchanting tale of Lily and the enchanted forest continued to inspire generations, reminding them that within each person lies the power to discover and create their own extraordinary story.</p>`,
                role: ""
            })
            setSelectedTab("2")
            return
        }
        setLoading(true)
        try {
            const apiRes = await fetch("/api/openai", {
                method: "post",
                body: JSON.stringify({ messages: values.title })
            })
            const apiJson = await apiRes.json()
            console.log("apiRes", apiRes);
            seState(apiJson)
            seState({
                content: `<img src=${selectedFile}/><p>${apiJson.content}</p>`,
                role: ""
            })
            setSelectedTab("2")
        } catch (error) {
            console.log("error", error);


        } finally {

            setLoading(false)
        }
        // const generated_text = apiRes.choices[0].text
        // console.log("generated_text", generated_text);

    };

    // const uploadProps: UploadProps = {
    //     name: 'file',
    //     multiple: true,
    //     action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    //     onChange(info) {
    //         setLoading(true)
    //         const { status } = info.file;
    //         if (status !== 'uploading') {
    //             console.log(info.file, info.fileList);
    //         }
    //         if (status === 'done' || status === 'error') {
    //             setSelectedFile(info.file.originFileObj)
    //             setLoading(false)
    //         }
    //     },
    //     onDrop(e) {
    //         console.log('Dropped files', e.dataTransfer.files);
    //         setSelectedFile(e.dataTransfer.files[0])

    //     },
    // };
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        setLoading(true);

        getBase64(file as FileType, (url) => {
            console.log("url", url);
            setLoading(false);
            setSelectedFile(url);
        });

        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };


    const createPdf = async () => {
        const editorValue = ReactQuillRef.current.value
        const element = `<html>
        <body>
        <img=${selectedFile}/>
        ${editorValue}
        </body>
        </html>`
        console.log("ele", element);

        await html2pdf(element);

    }


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <Flex
                align="center"
                gap={"small"}>
                <Button disabled type="primary" shape="circle">1</Button>Brochure title & Image
            </Flex>,
            children: <Form
                layout="vertical"
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Brochure Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input your title!' }]}

                >
                    <Input
                        count={{
                            show: true,
                            max: 50,
                        }} />
                </Form.Item>

                <Form.Item
                    label="Brochure Image"
                    name="image"
                    rules={[{ required: true, message: 'Please select image' }]}
                >
                    <Upload.Dragger
                        // {...uploadProps}
                        beforeUpload={beforeUpload}
                        accept="image/*"
                        showUploadList={false}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                            banned files.
                        </p>
                    </Upload.Dragger>
                </Form.Item>
                <Form.Item>

                    {selectedFile &&
                        <Image
                            width={500}
                            src={selectedFile}
                        />}
                </Form.Item>


                <Form.Item wrapperCol={{ offset: 24, span: 1 }}>
                    <Button type="primary" htmlType="submit" size="large">
                        Generate with AI
                    </Button>
                </Form.Item>
            </Form>,
        },
        {
            key: '2',
            label: <Flex align="center" gap={"small"}>  <Button disabled type="primary" shape="circle">2</Button>Generated Brochure
            </Flex>,
            children: <Flex align="center" gap={"small"}>
                {/* <Row gutter={16}>
                    <Col span={8}>
                        {selectedFile &&
                            <Image
                                width={500}
                                src={selectedFile}
                            />}
                    </Col>
                    <Col span={16}> */}
                <Flex
                    align="center"
                    gap={"small"}
                    vertical
                >

                    <ReactQuill theme="snow" value={state.content} placeholder="Write description here..." ref={ReactQuillRef} />
                    <Button type="dashed" size="large" onClick={createPdf}>
                        Generate PDF
                    </Button>
                </Flex>
                {/* </Col>
                </Row> */}
            </Flex>
        },

    ];


    return <Spin spinning={loading}>
        <Flex>
            <Tabs
                activeKey={selectedTab}
                items={items} />
        </Flex>;
    </Spin>
}

export default BrochuneInput