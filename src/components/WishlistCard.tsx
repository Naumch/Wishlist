import React from "react";
import { Card, Button, Tag, Space, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { type Wishlist } from "../types";
import { useAppDispatch } from "../store/hooks";
import {
  deleteWishlistRequest,
  setCurrentWishlist,
} from "../store/slices/wishlistSlce";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface WishlistCardProps {
  wishlist: Wishlist;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setCurrentWishlist(wishlist));
    navigate(`/wishlist/${wishlist.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteWishlistRequest(wishlist.id));
  };

  const handleClick = () => {
    dispatch(setCurrentWishlist(wishlist));
    navigate(`/wishlist/${wishlist.id}`);
  };

  return (
    <Card
      hoverable
      cover={
        wishlist.cover_image ? (
          <img alt={wishlist.title} src={wishlist.cover_image} />
        ) : (
          <div
            style={{
              height: 200,
              background: "#f0f2f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GiftOutlined style={{ fontSize: 48, color: "#bfbfbf" }} />
          </div>
        )
      }
      actions={[
        <Button
          key="view"
          icon={<EyeOutlined />}
          type="text"
          onClick={handleClick}
        />,
        <Button
          key="edit"
          icon={<EditOutlined />}
          type="text"
          onClick={handleEdit}
        />,
        <Button
          key="delete"
          icon={<DeleteOutlined />}
          type="text"
          danger
          onClick={handleDelete}
        />,
      ]}
      onClick={handleClick}
    >
      <Card.Meta
        title={
          <Space>
            {wishlist.title}
            {!wishlist.is_public && <LockOutlined />}
          </Space>
        }
        description={
          <>
            <Text type="secondary">{wishlist.description}</Text>
            <div style={{ marginTop: 8 }}>
              {wishlist.occasion && <Tag color="blue">{wishlist.occasion}</Tag>}
              {wishlist.event_date && (
                <Tag color="green">
                  {new Date(wishlist.event_date).toLocaleDateString()}
                </Tag>
              )}
              <Tag color="purple">{wishlist.items_count || 0} предметов</Tag>
            </div>
          </>
        }
      />
    </Card>
  );
};

export default WishlistCard;
