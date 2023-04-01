import React from "react";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Form, Button, Upload, Space } from "antd";
import fileServices from "../../features/files/fileServices";

function Setting() {
  const exportWithFull = (e) => {
    fileServices.exportAll();
  };
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
              <Upload
                bordered={false}
                name="csvFile"
                action="http://localhost:5000/embed/file/import"
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
        <div className="dashboard-setting-body-export">
          <strong>2. Xuất dữ liệu</strong>
          <div className="dashboard-setting-body-export-all">
            <Space>
              <Form layout="verticcal">
                <Form.Item label="Tất cả dữ liệu">
                  <Button
                    onClick={(e) => exportWithFull(e)}
                    type="primary"
                    icon={<DownloadOutlined />}
                  >
                    Download
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
