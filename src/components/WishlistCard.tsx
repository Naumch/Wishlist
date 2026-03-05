import React from "react";
import { useAppDispatch } from "../store/hooks";
import { useNavigate } from "react-router-dom";

import { Card, Button, Tag, Space, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
} from "@ant-design/icons";

import { type Wishlist } from "../types";
import {
  deleteWishlistRequest,
  setCurrentWishlist,
} from "../store/slices/wishlistSlice";

const { Text } = Typography;

interface WishlistCardProps {
  wishlist: Wishlist;
  onEdit: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    wishlist: Wishlist,
  ) => void;
}

const WishlistCard = ({ wishlist, onEdit }: WishlistCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteWishlistRequest(wishlist.id));
  };

  const handleClick = () => {
    dispatch(setCurrentWishlist(wishlist));
    navigate(`/wishlist/${wishlist.id}`);
  };

  return (
    <>
      <Card
        hoverable
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
            onClick={(e) => onEdit(e, wishlist)}
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
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
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
    </>
  );
};

export default WishlistCard;
