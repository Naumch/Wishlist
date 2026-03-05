import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Spin,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchItemsRequest,
  createItemRequest,
} from "../store/slices/itemSlice";
import ItemCard from "../components/ItemCard";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const WishlistDetail = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentWishlist, requests } = useAppSelector(
    (state) => state.wishlist,
  );
  const { items } = useAppSelector((state) => state.items);

  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [itemForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchItemsRequest(id));
    }
  }, [id, dispatch]);

  const handleCreateItem = async (values: any) => {
    if (!id) return;

    dispatch(
      createItemRequest({
        wishlistId: id,
        data: {
          title: values.title,
          description: values.description,
          price: values.price,
          link: values.link,
        },
      }),
    );

    setIsItemModalVisible(false);
    itemForm.resetFields();
    message.success("Подарок добавлен в список");
  };

  if (requests.fetchAll.loading && !currentWishlist) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/dashboard")}
            >
              Назад
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {currentWishlist?.title}
            </Title>
            {!currentWishlist?.is_public && <Tag color="red">Приватный</Tag>}
          </Space>
        </Col>

        <Col span={24}>
          <Card>
            <Paragraph>{currentWishlist?.description}</Paragraph>
            <Space>
              {currentWishlist?.event_date && (
                <Tag color="green">
                  Дата:{" "}
                  {new Date(currentWishlist.event_date).toLocaleDateString()}
                </Tag>
              )}
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Row justify="space-between" align="middle">
            <Title level={3}>Подарки ({items.length})</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsItemModalVisible(true)}
            >
              Добавить подарок
            </Button>
          </Row>
        </Col>

        {items.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.id}>
            <ItemCard item={item} />
          </Col>
        ))}

        {items.length === 0 && (
          <Col span={24}>
            <Card>
              <div style={{ textAlign: "center", padding: 40 }}>
                <Text type="secondary">В этом списке пока нет подарков</Text>
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    onClick={() => setIsItemModalVisible(true)}
                  >
                    Добавить первый подарок
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      <Modal
        title="Добавить подарок"
        open={isItemModalVisible}
        onCancel={() => setIsItemModalVisible(false)}
        footer={null}
      >
        <Form form={itemForm} layout="vertical" onFinish={handleCreateItem}>
          <Form.Item
            name="title"
            label="Название подарка"
            rules={[{ required: true, message: "Введите название подарка" }]}
          >
            <Input placeholder="PlayStation 5" />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <TextArea rows={3} placeholder="Подробное описание" />
          </Form.Item>

          <Form.Item name="link" label="Ссылка на товар">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Добавить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WishlistDetail;
