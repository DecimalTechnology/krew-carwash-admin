import React from "react";
import { Calendar, Camera, CheckCircle, Circle } from "lucide-react";
import { Session } from "../../interface/IBooking";
import { formatDate } from "./FormDate";

interface SessionCardProps {
    session: Session;
    index: number;
    total: number;
    type: "PACKAGE" | "ADDON";
    onClick:any
}

const SessionCard: React.FC<SessionCardProps> = ({ session, index, total,onClick }) => {
    const isCompleted = session.isCompleted;

    return (
        <div
            className={`
                relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 group
                ${
                    isCompleted
                        ? "bg-white dark:bg-gray-800 border-emerald-100 dark:border-gray-700 shadow-sm hover:border-emerald-200"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#5DB7AE] hover:shadow-md"
                }
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <span
                    className={`
                        text-xs font-bold px-2.5 py-1 rounded-md border
                        ${
                            isCompleted
                                ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/30"
                                : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/10"
                        }
                    `}
                >
                    Session {index + 1}
                </span>
                {isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-transparent" /> : <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />}
            </div>

            <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <Calendar className={`w-4 h-4 ${isCompleted ? "text-emerald-500" : "text-gray-400 dark:text-gray-500"}`} />
                    {formatDate(session.date)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-6">{session.completedBy ? "Completed" : "Scheduled"}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                {isCompleted ? (
                    <button onClick={onClick} className="flex-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                        Photos
                    </button>
                ) : (
                    <button className="flex-1 text-xs bg-white border border-gray-200 text-gray-600 hover:text-[#5DB7AE] hover:border-[#5DB7AE] py-2 rounded-lg font-medium transition-colors">
                        Reschedule
                    </button>
                )}
            </div>
        </div>
    );
};

export default SessionCard;
