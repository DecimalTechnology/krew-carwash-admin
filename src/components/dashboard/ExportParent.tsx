import { useEffect, useState } from "react";
import ExportExcel from "./ExportExcel";

import ExportCSV from "./ExportCSV";
import { getBookings } from "../../api/admin/dashboardService";
import ExportPdf from "./ExportPdf";




function ExportParent({ fromDate, toDate, filter,packageId ,buildingId,cleanerId}: any) {
    const [bookings,setBookings] = useState([])
 
    useEffect(() => {
        const fetchData = async () => {
            const res = await getBookings(fromDate, toDate, filter,packageId,buildingId,cleanerId);
            setBookings(res?.data)
            
        };

        fetchData();
    }, [filter, toDate, fromDate,packageId,buildingId,cleanerId]);
    return (
        <div className="flex flex-row">
            <ExportPdf bookings={bookings}/>
            <ExportExcel bookings={bookings} />
            <ExportCSV  bookings={bookings}/>
        </div>
    );
}

export default ExportParent;
