import React from "react";
import "./styles.css";
import { type IconProps } from "@phosphor-icons/react";

type UserInfoProps = {
  header: string;
  icon: React.ElementType<IconProps>;
  iconProps?: IconProps;
  colSpan: number;
  rowSpan: number;
};

const UserInfo: React.FC<UserInfoProps> = ({
  header,
  icon: Icon,
  iconProps,
  colSpan,
}) => {
  return (
    <div className={`bento-box row-span-3 col-span-${colSpan} `}>
      <div className="bento-header">
        <span>{header}</span>
        <Icon {...iconProps} />
      </div>
    </div>
  );
};

export default UserInfo;
