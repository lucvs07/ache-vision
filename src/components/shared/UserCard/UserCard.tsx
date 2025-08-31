import React from "react";
import "./styles.css";
import { type IconProps } from "@phosphor-icons/react";

type UserInfoProps = {
  header: string;
  icon: React.ElementType<IconProps>;
  iconProps?: IconProps;
};

const UserInfo: React.FC<UserInfoProps & { className?: string }> = ({
  header,
  icon: Icon,
  iconProps,
  className = "",
}) => {
  return (
    <div className={`bento-box ${className}`}>
      <div className="bento-header">
        <span>{header}</span>
        <Icon {...iconProps} />
      </div>
    </div>
  );
};

export default UserInfo;
