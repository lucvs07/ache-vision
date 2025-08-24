import React from "react";
import "./styles.css";
import { type IconProps, SquaresFourIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";

const sidebarItems = [
    { text: "Dashboard", icon: SquaresFourIcon },
    { text: "Histórico", icon: ClockCounterClockwiseIcon },
];


const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar-container mb-4">
        {sidebarItems.map((item) => (
            <SidebarIcon key={item.text} icon={item.icon} text={item.text} />
        ))}

    </aside>
  );
};

type SidebarIconProps = {
    icon: React.ElementType<IconProps>;
    text: string;
    iconProps?: IconProps;
};

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon: Icon, text, iconProps }) => {
    return (
        <div className="sidebar-icon">
            <Icon {...iconProps} size={32} weight="fill" className="icon"/>
            <span className="font-krona span-icon">{text}</span>
        </div>
    );
};

export default Sidebar;
