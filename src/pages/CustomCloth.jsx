import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Ruler, Palette, Image, X } from "lucide-react";

const MEASUREMENT_VALIDATIONS = {
  chest: { min: 20, max: 60 },
  waist: { min: 20, max: 60 },
  hips: { min: 20, max: 60 },
  length: { min: 20, max: 72 },
  shoulders: { min: 12, max: 30 },
  sleeves: { min: 15, max: 40 },
};

const CustomCloth = () => {
  const [activeTab, setActiveTab] = useState("measurements");
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    length: "",
    shoulders: "",
    sleeves: "",
  });
  const [measurementErrors, setMeasurementErrors] = useState({});

  const [design, setDesign] = useState({
    style: "",
    fabric: "",
    customization: "",
  });
  const [designErrors, setDesignErrors] = useState({});

  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateMeasurements = () => {
    const errors = {};
    Object.entries(measurements).forEach(([field, value]) => {
      const validation = MEASUREMENT_VALIDATIONS[field];
      if (!value) {
        errors[field] = "Required";
      } else if (value < validation.min) {
        errors[field] = `Must be at least ${validation.min} inches`;
      } else if (value > validation.max) {
        errors[field] = `Must be less than ${validation.max} inches`;
      }
    });
    setMeasurementErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDesign = () => {
    const errors = {};
    if (!design.style) errors.style = "Required";
    if (!design.fabric) errors.fabric = "Required";
    if (!design.customization) errors.customization = "Required";
    setDesignErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMeasurementChange = (field, value) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (measurementErrors[field]) {
      setMeasurementErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleDesignChange = (field, value) => {
    setDesign((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (designErrors[field]) {
      setDesignErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValid =
        file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024;
      if (!isValid) {
        setError("Please upload only images under 5MB");
      }
      return isValid;
    });
    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Validate all sections first
      const isMeasurementsValid = validateMeasurements();
      const isDesignValid = validateDesign();

      if (!isMeasurementsValid || !isDesignValid || attachments.length === 0) {
        throw new Error("Please complete all required fields");
      }

      const formData = new FormData();
      formData.append("measurements", JSON.stringify(measurements));
      formData.append("design", JSON.stringify(design));
      attachments.forEach((file) => {
        formData.append("referenceImages", file);
      });

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-order`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit custom order");
      }

      setSuccess(
        "Custom order submitted successfully!"
      );

      console.log("Sending data:", {
        measurements,
        design,
        attachments: attachments.map((f) => f.name),
      });
      // Reset form
      resetForm();
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      setActiveTab(getErrorTab(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to reset form
  const resetForm = () => {
    setMeasurements({
      chest: "",
      waist: "",
      hips: "",
      length: "",
      shoulders: "",
      sleeves: "",
    });
    setDesign({
      style: "",
      fabric: "",
      customization: "",
    });
    setAttachments([]);
  };

  // Helper function to determine which tab to show based on error
  const getErrorTab = (error) => {
    if (error.message.includes("measurement")) return "measurements";
    if (error.message.includes("design")) return "design";
    if (error.message.includes("image")) return "reference";
    return "measurements";
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Design Your Custom Clothing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid grid-cols-3">
                <TabsTrigger
                  value="measurements"
                  className="flex items-center gap-2"
                >
                  <Ruler size={16} /> Measurements
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center gap-2">
                  <Palette size={16} /> Design
                </TabsTrigger>
                <TabsTrigger
                  value="reference"
                  className="flex items-center gap-2"
                >
                  <Image size={16} /> Reference
                </TabsTrigger>
              </TabsList>

              <TabsContent value="measurements">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(measurements).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="capitalize">
                        {field} (inches)
                      </Label>
                      <Input
                        id={field}
                        type="number"
                        value={measurements[field]}
                        onChange={(e) =>
                          handleMeasurementChange(field, e.target.value)
                        }
                        placeholder={`Enter ${field} measurement`}
                        className={`w-full ${
                          measurementErrors[field] ? "border-red-500" : ""
                        }`}
                      />
                      {measurementErrors[field] && (
                        <p className="text-red-500 text-sm">
                          {measurementErrors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="design">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="style">Style</Label>
                    <Select
                      value={design.style}
                      onValueChange={(value) =>
                        handleDesignChange("style", value)
                      }
                    >
                      <SelectTrigger
                        className={designErrors.style ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="fusion">Fusion</SelectItem>
                      </SelectContent>
                    </Select>
                    {designErrors.style && (
                      <p className="text-red-500 text-sm">
                        {designErrors.style}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fabric">Fabric Preference</Label>
                    <Select
                      value={design.fabric}
                      onValueChange={(value) =>
                        handleDesignChange("fabric", value)
                      }
                    >
                      <SelectTrigger
                        className={designErrors.fabric ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select fabric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="silk">Silk</SelectItem>
                        <SelectItem value="linen">Linen</SelectItem>
                        <SelectItem value="wool">Wool</SelectItem>
                      </SelectContent>
                    </Select>
                    {designErrors.fabric && (
                      <p className="text-red-500 text-sm">
                        {designErrors.fabric}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customization">Special Requirements</Label>
                    <Textarea
                      id="customization"
                      value={design.customization}
                      onChange={(e) =>
                        handleDesignChange("customization", e.target.value)
                      }
                      placeholder="Describe any special requirements or customizations"
                      className={`h-32 ${
                        designErrors.customization ? "border-red-500" : ""
                      }`}
                    />
                    {designErrors.customization && (
                      <p className="text-red-500 text-sm">
                        {designErrors.customization}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reference">
                <div className="space-y-4">
                  <Label>Upload Reference Images</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">
                    Upload up to 5 images (max 5MB each) to help us understand
                    your design preferences
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {attachments.length > 0 ? (
                      attachments.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-40 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500">
                        No images uploaded yet
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Submitting..." : "Submit Custom Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomCloth;
