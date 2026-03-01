import React, { useEffect, useState } from "react";
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
  InputNumber,
  Select,
  List,
  Avatar,
  Divider,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchItemsRequest,
  fetchCommentsRequest,
  addCommentRequest,
  fetchCategoriesRequest,
  createItemRequest,
} from "../store/slices/wishlistSlce";
import ItemCard from "../components/ItemCard";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const WishlistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentWishlist, items, categories, comments, loading } =
    useAppSelector((state) => state.wishlist);

  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [itemForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchItemsRequest(id));
      dispatch(fetchCategoriesRequest());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedItem) {
      dispatch(fetchCommentsRequest(selectedItem.id));
    }
  }, [selectedItem, dispatch]);

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

  const handleCommentSubmit = () => {
    if (!selectedItem || !commentText.trim()) return;

    // Здесь нужно получить текущего пользователя из auth
    const userId = "current-user-id"; // Замените на реальный ID

    dispatch(
      addCommentRequest({
        itemId: selectedItem.id,
        content: commentText,
        userId,
      }),
    );

    setCommentText("");
  };

  if (loading && !currentWishlist) {
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
              {currentWishlist?.occasion && (
                <Tag color="blue">Повод: {currentWishlist.occasion}</Tag>
              )}
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
            <ItemCard item={item} onCommentClick={setSelectedItem} />
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

      {/* Модальное окно для комментариев */}
      <Modal
        title={`Комментарии к подарку: ${selectedItem?.title}`}
        open={!!selectedItem}
        onCancel={() => setSelectedItem(null)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <>
            <List
              dataSource={comments[selectedItem.id] || []}
              renderItem={(comment: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={comment.profile?.avatar_url} />}
                    title={
                      comment.profile?.full_name || comment.profile?.username
                    }
                    description={comment.content}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(comment.created_at).toLocaleString()}
                  </Text>
                </List.Item>
              )}
            />

            <Divider />

            <Space.Compact style={{ width: "100%" }}>
              <TextArea
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Напишите комментарий..."
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleCommentSubmit}
              >
                Отправить
              </Button>
            </Space.Compact>
          </>
        )}
      </Modal>

      {/* Модальное окно для добавления подарка */}
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Цена">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="10000"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currency" label="Валюта" initialValue="RUB">
                <Select>
                  <Option value="RUB">₽</Option>
                  <Option value="USD">$</Option>
                  <Option value="EUR">€</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="link" label="Ссылка на товар">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="priority" label="Приоритет">
            <Select placeholder="Выберите приоритет">
              <Option value={1}>⭐ Низкий</Option>
              <Option value={2}>⭐⭐ Средний</Option>
              <Option value={3}>⭐⭐⭐ Высокий</Option>
              <Option value={4}>⭐⭐⭐⭐ Очень высокий</Option>
              <Option value={5}>⭐⭐⭐⭐⭐ Мечта</Option>
            </Select>
          </Form.Item>

          <Form.Item name="category_ids" label="Категории">
            <Select mode="multiple" placeholder="Выберите категории">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </Option>
              ))}
            </Select>
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
