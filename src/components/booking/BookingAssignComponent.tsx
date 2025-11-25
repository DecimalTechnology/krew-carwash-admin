function BookingAssignComponent({ cleaners = [] ,setCleanerModal,setSelectedCleaners,booking,setSelectedBookingId}: any) {
    const hasCleaners = cleaners.length > 0;

    const letterColors = [
        "#6C5CE7",
        "#0984E3",
        "#00B894",
        "#E17055",
        "#D63031",
        "#FDCB6E",
        "#B53471",
    ];

    const getLetterColor = (index: number) => {
        return letterColors[index % letterColors.length];
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {hasCleaners ? (
                <>
                    {cleaners.map((cleaner: any, index: number) => (
                        <div
                            key={index}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "2px solid white",
                                background: "#e6e6e6",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: index === 0 ? "0px" : "-10px",
                                zIndex: cleaners.length - index,
                            }}
                        >
                            {cleaner?.image ? (
                                <img
                                    src={cleaner.image}
                                    alt="cleaner"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <span
                                    style={{
                                        fontWeight: "700",
                                        fontSize: "15px",
                                        color: getLetterColor(index),
                                    }}
                                >
                                    {cleaner?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            )}
                        </div>
                    ))}

                    {/* PLUS BUTTON */}
                    <button
                     onClick={()=>{setCleanerModal(true);setSelectedCleaners(cleaners);setSelectedBookingId(booking?._id)}}
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#f5f5f5",
                            border: "1px solid #ccc",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "18px",
                            cursor: "pointer",
                            marginLeft: "-10px",
                        }}
                    >
                        +
                    </button>
                </>
            ) : (
                // SINGLE "Assign +" BUTTON
                <button
                    onClick={()=>{setCleanerModal(true);setSelectedCleaners(cleaners);setSelectedBookingId(booking?._id)}}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 12px",
                        borderRadius: "16px",
                        background: "#f5f5f5",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "500",
                    }}
                >
                    Assign
                    <span style={{ fontSize: "18px", marginTop: "-2px" }}>+</span>
                </button>
            )}
        </div>
    );
}

export default BookingAssignComponent;
