import React from "react";
import { Card, Button, Tag, Space, Typography, Avatar, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  CommentOutlined,
  DollarOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { Item } from "../types";
import { useAppDispatch } from "../store/hooks";
import {
  deleteItemRequest,
  reserveItemRequest,
} from "../store/slices/wishlistSlce";

const { Text, Paragraph } = Typography;

interface ItemCardProps {
  item: Item;
  currentUserId?: string;
  onCommentClick?: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  currentUserId,
  onCommentClick,
}) => {
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

  const handleCommentClick = () => {
    onCommentClick?.(item);
  };

  const isOwner = item.wishlist_id === currentUserId; // упрощенно, нужно проверять владельца wishlist

  return (
    <Card
      style={{
        opacity: item.is_reserved ? 0.7 : 1,
        transition: "opacity 0.3s",
      }}
      actions={[
        <Tooltip title="Комментарии">
          <Button
            key="comments"
            icon={<CommentOutlined />}
            type="text"
            onClick={handleCommentClick}
          />
        </Tooltip>,
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
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
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
          {item.categories?.map((cat) => (
            <Tag key={cat.id} color="cyan">
              {cat.icon} {cat.name}
            </Tag>
          ))}
        </Space>

        {item.is_reserved && item.reserver && (
          <Space>
            <Text type="danger">Зарезервировано:</Text>
            <Avatar src={item.reserver.avatar_url} size="small" />
            <Text>{item.reserver.full_name || item.reserver.username}</Text>
          </Space>
        )}

        {item.comments && item.comments.length > 0 && (
          <Text type="secondary">💬 {item.comments.length} комментариев</Text>
        )}
      </Space>
    </Card>
  );
};

export default ItemCard;
