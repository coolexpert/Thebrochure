"use client"
import { Button, Flex, Form, Image, Input, Tabs, Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons';

import type { TabsProps, UploadProps } from 'antd';
import React from "react";

const BrochuneInput = () => {

    const [selectedFile, setSelectedFile] = React.useState(null as any)

    const onChange = (key: string) => {
        console.log(key);
    };
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setSelectedFile(info.file.originFileObj)
            } else if (status === 'error') {
                setSelectedFile(info.file.originFileObj)

            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
            setSelectedFile(e.dataTransfer.files[0])

        },
    };


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
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Brochure Image"
                    name="image"
                    rules={[{ required: true, message: 'Please select image' }]}
                >
                    <Upload.Dragger {...uploadProps}
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
                            src={URL.createObjectURL(selectedFile)}
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
            children: 'Content of Tab Pane 2',
        },

    ];


    return <Flex>
        <h1>hamim</h1>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

    </Flex>;
}

export default BrochuneInput