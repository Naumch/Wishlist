import { Card, Button, Tag, Space, Typography, Avatar, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  DollarOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { Item } from "../types";
import { useAppDispatch } from "../store/hooks";
import {
  deleteItemRequest,
  reserveItemRequest,
} from "../store/slices/itemSlice";

const { Text, Paragraph } = Typography;

interface ItemCardProps {
  item: Item;
  currentUserId?: string;
}

const ItemCard = ({ item, currentUserId }: ItemCardProps) => {
  const dispatch = useAppDispatch();

  const handleReserve = () => {
    if (currentUserId && !item.is_reserved) {
      dispatch(
        reserveItemRequest({
          itemId: item.id,
          userId: currentUserId,
        }),
      );
    }
  };

  const handleDelete = () => {
    dispatch(deleteItemRequest(item.id));
  };

  const isOwner = item.wishlist_id === currentUserId; // упрощенно, нужно проверять владельца wishlist

  return (
    <Card
      style={{
        opacity: item.is_reserved ? 0.7 : 1,
        transition: "opacity 0.3s",
      }}
      actions={[
        !isOwner && !item.is_reserved && (
          <Tooltip title="Зарезервировать">
            <Button
              key="reserve"
              icon={<ShoppingOutlined />}
              type="text"
              onClick={handleReserve}
            />
          </Tooltip>
        ),
        isOwner && (
          <Tooltip title="Редактировать">
            <Button key="edit" icon={<EditOutlined />} type="text" />
          </Tooltip>
        ),
        isOwner && (
          <Tooltip title="Удалить">
            <Button
              key="delete"
              icon={<DeleteOutlined />}
              type="text"
              danger
              onClick={handleDelete}
            />
          </Tooltip>
        ),
      ].filter(Boolean)}
    >
      <Space orientation="vertical" size="small" style={{ width: "100%" }}>
        <Space
          align="start"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <Space>
            {item.image_url ? (
              <Avatar shape="square" size={48} src={item.image_url} />
            ) : (
              <Avatar shape="square" size={48} icon={<ShoppingOutlined />} />
            )}
            <div>
              <Text strong>{item.title}</Text>
              <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                {item.description}
              </Paragraph>
            </div>
          </Space>
          {item.priority && (
            <Tag color={item.priority > 3 ? "red" : "green"}>
              Приоритет: {item.priority}
            </Tag>
          )}
        </Space>

        <Space wrap>
          {item.price && (
            <Tag icon={<DollarOutlined />} color="gold">
              {item.price} {item.currency}
            </Tag>
          )}
          {item.link && (
            <Tag icon={<LinkOutlined />} color="blue">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Ссылка
              </a>
            </Tag>
          )}
        </Space>

        {item.is_reserved && item.reserver && (
          <Space>
            <Text type="danger">Зарезервировано:</Text>
            <Avatar src={item.reserver.avatar_url} size="small" />
            <Text>{item.reserver.full_name || item.reserver.username}</Text>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default ItemCard;
