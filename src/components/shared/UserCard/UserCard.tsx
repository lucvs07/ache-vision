import React from "react";
import "./styles.css";
import { type IconProps } from "@phosphor-icons/react";

type UserInfoProps = {
  header: string;
  icon: React.ElementType<IconProps>;
  iconProps?: IconProps;
  aprovados?: number;
  comAvarias?: number;
};

const UserInfo: React.FC<UserInfoProps & { className?: string }> = ({
  header,
  icon: Icon,
  iconProps,
  className = "",
  aprovados,
  comAvarias,
}) => {
  return (
    <div className={`bento-user ${className}`}>
      <div className="bento-header">
        <span>{header}</span>
        <Icon {...iconProps} />
      </div>
      <div className="bento-content">
        {aprovados !== undefined && (
          <div>
            <strong>Aprovados:</strong> {aprovados}
          </div>
        )}
        {comAvarias !== undefined && (
          <div>
            <strong>Com Avarias:</strong> {comAvarias}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
