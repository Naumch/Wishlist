import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import WishlistCard from "../components/WishlistCard";
import { PlusOutlined } from "@ant-design/icons";
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
  DatePicker,
  message,
} from "antd";
import moment from "moment";
import { type Wishlist } from "../types";

import {
  fetchWishlistsRequest,
  createWishlistRequest,
} from "../store/slices/wishlistSlice";

const { Title } = Typography;

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { lists, requests } = useAppSelector((state) => state.wishlist);

  const isLoadingFetchAll = requests.fetchAll.loading;
  const isLoadingCreate = requests.create.loading;

  const fetchAllError = requests.fetchAll.error;
  const createError = requests.create.error;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchWishlistsRequest());
  }, [dispatch]);

  const handleEdit = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    wishlist: Wishlist,
  ) => {
    e.stopPropagation();
    setEditingWishlist(wishlist);
    form.setFieldsValue({
      title: wishlist.title,
      description: wishlist.description,
      event_date: moment(wishlist.event_date),
      is_public: wishlist.is_public,
    });
    setIsModalVisible(true);
  };

  const handleCreateWishlist = async (values: any) => {
    dispatch(createWishlistRequest(values));
    setIsModalVisible(false);
    form.resetFields();
  };

  if (isLoadingFetchAll) {
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

      {lists.length === 0 ? (
        <Empty description="У вас пока нет списков желаний">
          <Button
            type="primary"
            onClick={() => {
              setEditingWishlist(null);
              setIsModalVisible(true);
            }}
          >
            Создать первый список
          </Button>
        </Empty>
      ) : (
        <Row gutter={[24, 24]}>
          {lists.map((wishlist) => (
            <Col xs={24} sm={12} md={8} lg={6} key={wishlist.id}>
              <WishlistCard wishlist={wishlist} onEdit={handleEdit} />
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

          <Form.Item
            name="event_date"
            label="Дата события"
            rules={[{ required: true, message: "Выберите дату события" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Выберите дату"
              format="DD.MM.YYYY"
              disabledDate={(current) => {
                return current && current < moment().startOf("day");
              }}
            />
          </Form.Item>

          <Form.Item
            name="is_public"
            label="Публичный список"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoadingCreate}
              disabled={isLoadingCreate}
            >
              Создать
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
