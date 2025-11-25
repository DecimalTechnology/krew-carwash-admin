export const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-500 bg-yellow-100";
      case "ASSIGNED":
        return "text-blue-500 bg-blue-100";
      case "IN PROGRESS":
        return "text-purple-500 bg-purple-100";
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };
  