// in src/MyLayout.js
import { Layout } from "react-admin";
import Menu from "./menu";
import AppBar from "./appBar";

const MyLayout = (props) => <Layout {...props} menu={Menu} appBar={AppBar} />;

export default MyLayout;
