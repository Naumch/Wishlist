import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  ConfigProvider,
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Spin,
  type MenuProps,
} from "antd";
import ruRU from "antd/lib/locale/ru_RU";
import { GiftOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Dashboard from "./pages/Dashboard";
import WishlistDetail from "./pages/WishlistDetail";
import SimpleAuth from "./components/Auth";
import { supabase } from "./services/supabase";

const { Header, Content } = Layout;

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Профиль",
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Выйти",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <ConfigProvider locale={ruRU}>
        <SimpleAuth />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider locale={ruRU}>
      <BrowserRouter>
        <Layout style={{ minHeight: "100vh" }}>
          <Header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#fff",
              padding: "0 24px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <GiftOutlined style={{ fontSize: 24, color: "#1890ff" }} />
              <span style={{ fontSize: 18, fontWeight: "bold" }}>Wishlist</span>
              <Menu
                mode="horizontal"
                style={{ border: "none" }}
                items={[
                  {
                    key: "dashboard",
                    label: <a href="/dashboard">Главная</a>,
                  },
                ]}
              />
            </div>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>{user.user_metadata?.full_name || user.email}</span>
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  icon={<UserOutlined />}
                />
              </div>
            </Dropdown>
          </Header>

          <Content>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wishlist/:id" element={<WishlistDetail />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
