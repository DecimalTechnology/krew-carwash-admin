import React from "react";
import LeftChatPannel from "../../components/chat/LeftChatPannel";
import RightChatPannel from "../../components/chat/RightChatPannel";

const IssueReports: React.FC = () => {


    return (
        <div className="flex h-screen bg-white fixed w-[79%]">
           
            <LeftChatPannel />

           
            <RightChatPannel />
        </div>
    );
};

export default IssueReports;
