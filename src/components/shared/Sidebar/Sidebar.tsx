import React from "react";
import "./styles.css";
import {
  type IconProps,
  SquaresFourIcon,
  ClockCounterClockwiseIcon,
  MagnifyingGlassIcon
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const sidebarItems = [
  { text: "Dashboard", icon: SquaresFourIcon, to: "/" },
  { text: "Histórico", icon: ClockCounterClockwiseIcon, to: "/historico" },
  { text: "Consulta", icon: MagnifyingGlassIcon, to: "/consulta" },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar-container mb-4">
      {sidebarItems.map((item) => (
        <Link to={item.to} key={item.text}>
          <SidebarIcon icon={item.icon} text={item.text} />
        </Link>
      ))}
    </aside>
  );
};

type SidebarIconProps = {
  icon: React.ElementType<IconProps>;
  text: string;
  iconProps?: IconProps;
};

const SidebarIcon: React.FC<SidebarIconProps> = ({
  icon: Icon,
  text,
  iconProps,
}) => {
  return (
    <div className="sidebar-icon">
      <Icon {...iconProps} size={32} weight="fill" className="icon" />
      <span className="font-krona span-icon">{text}</span>
    </div>
  );
};

export default Sidebar;
