import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
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
import {
  GiftOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { store } from "./store";
import Dashboard from "./pages/Dashboard";
import WishlistDetail from "./pages/WishlistDetail";
import SimpleAuth from "./components/SimpleAuth";
import { supabase } from "./services/supabase";

const { Header, Content, Footer } = Layout;

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Слушаем изменения авторизации
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

  // Меню пользователя
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
      <Provider store={store}>
        <ConfigProvider locale={ruRU}>
          <SimpleAuth />
        </ConfigProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <GiftOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <span style={{ fontSize: 18, fontWeight: "bold" }}>
                  Wishlist
                </span>
                <Menu mode="horizontal" style={{ border: "none" }}>
                  <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                    <a href="/dashboard">Главная</a>
                  </Menu.Item>
                </Menu>
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

            <Footer style={{ textAlign: "center" }}>
              Wishlist App ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
