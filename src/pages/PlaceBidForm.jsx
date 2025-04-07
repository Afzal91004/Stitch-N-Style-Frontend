// Stitch-N-Style-Designers/src/components/PlaceBidForm.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const PlaceBidForm = ({ order, onBidPlaced, existingBid = null }) => {
  const isEditing = !!existingBid;

  const [formData, setFormData] = useState({
    amount: existingBid?.amount || "",
    estimatedDeliveryDays: existingBid?.estimatedDeliveryDays || 7,
    message: existingBid?.message || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "amount" || name === "estimatedDeliveryDays"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? `${import.meta.env.VITE_BACKEND_URL}/api/designer/bid/${
            existingBid._id
          }`
        : `${import.meta.env.VITE_BACKEND_URL}/api/designer/bid`;

      const method = isEditing ? "PUT" : "POST";

      const requestData = isEditing
        ? formData
        : { ...formData, orderId: order._id };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place bid");
      }

      toast.success(
        isEditing ? "Bid updated successfully" : "Bid placed successfully"
      );
      if (onBidPlaced) onBidPlaced(data.bid);
    } catch (error) {
      console.error("Error placing bid:", error);
      setError(error.message || "Something went wrong. Please try again.");
      toast.error(error.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center text-sm">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Your Bid Amount (₹)
        </label>
        <Input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          required
          className="w-full"
          placeholder="Enter your bid amount"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Estimated Delivery (Days)
        </label>
        <Input
          type="number"
          name="estimatedDeliveryDays"
          value={formData.estimatedDeliveryDays}
          onChange={handleChange}
          min="1"
          max="60"
          required
          className="w-full"
          placeholder="Number of days to complete"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Message to Customer (Optional)
        </label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full"
          placeholder="Describe your approach, materials, or any questions you have"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600"
        disabled={loading}
      >
        {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
        {isEditing ? "Update Bid" : "Place Bid"}
      </Button>
    </form>
  );
};

export default PlaceBidForm;
