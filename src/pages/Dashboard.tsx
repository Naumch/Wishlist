import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Typography,
  Empty,
  Spin,
  Modal,
  Form,
  Input,
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchWishlistsRequest,
  createWishlistRequest,
} from "../store/slices/wishlistSlce";
import WishlistCard from "../components/WishlistCard";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { wishlists, loading } = useAppSelector((state) => state.wishlist);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchWishlistsRequest());
  }, [dispatch]);

  const handleCreateWishlist = async (values: any) => {
    dispatch(createWishlistRequest(values));
    setIsModalVisible(false);
    form.resetFields();
  };

  if (loading && wishlists.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Мои списки желаний</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Создать список
          </Button>
        </Col>
      </Row>

      {wishlists.length === 0 ? (
        <Empty description="У вас пока нет списков желаний">
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Создать первый список
          </Button>
        </Empty>
      ) : (
        <Row gutter={[24, 24]}>
          {wishlists.map((wishlist) => (
            <Col xs={24} sm={12} md={8} lg={6} key={wishlist.id}>
              <WishlistCard wishlist={wishlist} />
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Создать новый список желаний"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateWishlist}>
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: "Введите название списка" }]}
          >
            <Input placeholder="Мои подарки на день рождения" />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} placeholder="Краткое описание" />
          </Form.Item>

          <Form.Item name="occasion" label="Повод">
            <Input placeholder="День рождения, Новый год и т.д." />
          </Form.Item>

          <Form.Item
            name="is_public"
            label="Публичный список"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Создать
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
