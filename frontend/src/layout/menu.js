import * as React from "react";
import { useState } from "react";

import { useSelector } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { DashboardMenuItem, MenuItemLink, getResources } from "react-admin";
import SubMenu from "./submenu";
import DefaultIcon from "@material-ui/icons/ViewList";
import LabelIcon from "@material-ui/icons/Label";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import InfoIcon from "@material-ui/icons/Info";
import StakingIcon from "@material-ui/icons/AttachMoney";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const Menu = ({ onMenuClick, logout, dense = false }) => {
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const resources = useSelector(getResources);

  const [state, setState] = useState({
    menuStaking: true,
    menuSales: true,
    menuCustomers: true,
  });

  const handleToggle = (menu) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  return (
    <div>
      <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />
      <SubMenu
        handleToggle={() => handleToggle("menuStaking")}
        isOpen={state.menuStaking}
        sidebarIsOpen={open}
        name="Accounts"
        icon={<StakingIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/accounts/status"
          primaryText="Account Status"
          leftIcon={<StakingIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
        />
      </SubMenu>
      {resources.map((resource) => {
        return (
          resource.hasList &&
          resource.name !== "validators2" && (
            <MenuItemLink
              key={resource.name}
              to={`/${resource.name}`}
              primaryText={
                (resource.options && resource.options.label) || resource.name
              }
              leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
              onClick={onMenuClick}
              sidebarIsOpen={open}
            />
          )
        );
      })}
      <MenuItemLink
        to="/links"
        primaryText="Useful Links"
        leftIcon={<BookmarkIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
      />
      {/* <MenuItemLink
        to="/change-log"
        primaryText="Change Log"
        leftIcon={<LabelIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
      /> 
      <MenuItemLink
        to="/system"
        primaryText="System"
        leftIcon={<LabelIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
      />*/}
      <MenuItemLink
        to="/about"
        primaryText="About"
        leftIcon={<InfoIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
      />
      {isXSmall && logout}
    </div>
  );
};

export default Menu;
