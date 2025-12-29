import {Users, Bell, CalendarCheck, DollarSign, Shield, Wrench } from "lucide-react";


  // Helper function for notification type icons
    export const getTypeIcon = (type: string) => {
        switch (type) {
            case "BOOKING":
                return <CalendarCheck size={18} />;
            case "PAYMENT":
                return <DollarSign size={18} />;
            case "ISSUE REPORTS":
                return <Wrench size={18} />;
            default:
                return <Bell size={18} />;
        }
    };

    // Helper function for receiver model icons
    export const getReceiverIcon = (model: string) => {
        switch (model) {
            case "User":
                return <Users size={14} />;
            case "Admin":
                return <Shield size={14} />;
            case "Cleaner":
                return <Wrench size={14} />;
            default:
                return <Users size={14} />;
        }
    };
