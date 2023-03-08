import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, Button, Upload } from "antd";

function Setting() {
  return (
    <div className="dashboard-setting">
      <div className="dashboard-setting-head">
        <h2>Cài đặt sản phẩm</h2>
      </div>
      <div className="dashboard-setting-body">
        <div className="dashboard-setting-body-import">
          <strong>1. Nhập dữ liệu từ Excel</strong>
          <Form layout="verticcal">
            <Form.Item label="Upload">
              <Upload bordered={false} name="csvFile" action="http://localhost:5000/embed/upload">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
        <div className="dashboard-setting-body-config">
          <strong>2. Xuất dữ liệu</strong>
        </div>
      </div>
    </div>
  );
}

export default Setting;
