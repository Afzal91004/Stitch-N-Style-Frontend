import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Loader2,
  Ruler,
  Palette,
  Image,
  X,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { SuccessModal } from "@/components/SuccessModal";
import { Button } from "@/components/ui/button"; // Make sure this import exists

const MEASUREMENT_VALIDATIONS = {
  chest: { min: 20, max: 60 },
  waist: { min: 20, max: 60 },
  hips: { min: 20, max: 60 },
  length: { min: 20, max: 72 },
  shoulders: { min: 12, max: 30 },
  sleeves: { min: 0, max: 40 },
};

// Size chart mapping
const SIZE_MEASUREMENTS = {
  XS: {
    chest: "30-32",
    waist: "24-26",
    hips: "32-34",
    shoulders: "14-15",
    sleeves: "20-21",
    length: "25-26",
  },
  S: {
    chest: "34-36",
    waist: "28-30",
    hips: "36-38",
    shoulders: "15-16",
    sleeves: "22-23",
    length: "27-28",
  },
  M: {
    chest: "38-40",
    waist: "32-34",
    hips: "40-42",
    shoulders: "17-18",
    sleeves: "24-25",
    length: "29-30",
  },
  L: {
    chest: "42-44",
    waist: "36-38",
    hips: "44-46",
    shoulders: "19-20",
    sleeves: "26-27",
    length: "31-32",
  },
  XL: {
    chest: "46-48",
    waist: "40-42",
    hips: "48-50",
    shoulders: "21-22",
    sleeves: "28-29",
    length: "33-34",
  },
  XXL: {
    chest: "50-52",
    waist: "44-46",
    hips: "52-54",
    shoulders: "23-24",
    sleeves: "30-31",
    length: "35-36",
  },
};

const CustomCloth = () => {
  const [activeTab, setActiveTab] = useState("measurements");
  const [selectedSize, setSelectedSize] = useState("");
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    length: "",
    shoulders: "",
    sleeves: "",
  });
  const [measurementErrors, setMeasurementErrors] = useState({});
  const [measurementMode, setMeasurementMode] = useState("standard"); // "standard" or "custom"

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
  const [progress, setProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateMeasurements = () => {
    if (measurementMode === "standard") {
      if (!selectedSize) {
        setError("Please select a size");
        return false;
      }
      return true;
    }

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

  const validateReference = () => {
    if (attachments.length === 0) {
      setError("Please upload at least one reference image");
      return false;
    }
    return true;
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

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    // Populate measurements with the selected size's values (middle values for range)
    const sizeData = SIZE_MEASUREMENTS[size];
    const newMeasurements = {};

    Object.entries(sizeData).forEach(([key, range]) => {
      const [min, max] = range.split("-").map(Number);
      newMeasurements[key] = Math.round((min + max) / 2);
    });

    setMeasurements(newMeasurements);
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
      // Final validation on submission
      const isMeasurementsValid = validateMeasurements();
      const isDesignValid = validateDesign();
      const isReferenceValid = validateReference();

      if (!isMeasurementsValid || !isDesignValid || !isReferenceValid) {
        throw new Error("Please complete all required fields");
      }

      const formData = new FormData();

      // Add size selection
      formData.append("size", selectedSize);
      formData.append("measurementMode", measurementMode);
      formData.append("measurements", JSON.stringify(measurements));
      formData.append("design", JSON.stringify(design));

      attachments.forEach((file) => {
        formData.append("referenceImages", file);
      });

      // Mock progress for better UX
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

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

      clearInterval(interval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit custom order");
      }

      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      setActiveTab(getErrorTab(error));
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Navigation between tabs
  const goToNextTab = () => {
    if (activeTab === "measurements") {
      if (validateMeasurements()) {
        setActiveTab("design");
        setError("");
      }
    } else if (activeTab === "design") {
      if (validateDesign()) {
        setActiveTab("reference");
        setError("");
      }
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
    setSelectedSize("");
    setMeasurementMode("standard");
    setActiveTab("measurements");
  };

  // Helper function to determine which tab to show based on error
  const getErrorTab = (error) => {
    if (error.message.includes("measurement")) return "measurements";
    if (error.message.includes("design")) return "design";
    if (error.message.includes("image")) return "reference";
    return "measurements";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-pink-100">
      <div className="container mx-auto p-4 max-w-5xl ">
        <Card className="shadow-xl border-none bg-gradient-to-br from-white to-pink-50">
          <CardHeader className="bg-gradient-to-r from-pink-100 via-purple-50 to-white-100 rounded-t-xl">
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-[2px] bg-gradient-to-r from-pink-400 to-transparent"></div>
                <CardTitle className="text-3xl font-extrabold">
                  <span className="text-pink-500">Design Your</span>
                  <span className="text-gray-800"> Dream Outfit</span>
                </CardTitle>
                <div className="w-20 h-[2px] bg-gradient-to-r from-gray-800 to-transparent"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-pink-700 font-semibold">
                    Step{" "}
                    {activeTab === "measurements"
                      ? "1"
                      : activeTab === "design"
                      ? "2"
                      : "3"}{" "}
                    of 3
                  </span>
                  <span className="text-pink-700 font-semibold">
                    {activeTab === "measurements"
                      ? "Measurements"
                      : activeTab === "design"
                      ? "Design"
                      : "Reference"}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-white-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{
                      width: `${
                        activeTab === "measurements"
                          ? 33
                          : activeTab === "design"
                          ? 66
                          : isSubmitting
                          ? progress
                          : 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-8 grid grid-cols-3 bg-gradient-to-r from-pink-50 to-white-50 p-1 rounded-xl">
                  <TabsTrigger
                    value="measurements"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-md rounded-lg transition-all duration-300"
                  >
                    <Ruler size={18} /> Measurements
                  </TabsTrigger>
                  <TabsTrigger
                    value="design"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-md rounded-lg transition-all duration-300"
                  >
                    <Palette size={18} /> Design
                  </TabsTrigger>
                  <TabsTrigger
                    value="reference"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-md rounded-lg transition-all duration-300"
                  >
                    <Image size={18} /> Reference
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="measurements" className="space-y-6">
                  <div className="flex flex-col space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
                      <h3 className="font-semibold text-lg mb-2 text-pink-800">
                        Size Selection
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Choose a standard size or enter custom measurements
                      </p>

                      <div className="mb-4">
                        <RadioGroup className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              id="standard"
                              value="standard"
                              checked={measurementMode === "standard"}
                              onClick={() => setMeasurementMode("standard")}
                            />
                            <Label htmlFor="standard">Use standard size</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              id="custom"
                              value="custom"
                              checked={measurementMode === "custom"}
                              onClick={() => setMeasurementMode("custom")}
                            />
                            <Label htmlFor="custom">
                              Enter custom measurements
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {measurementMode === "standard" && (
                        <div className="space-y-3">
                          <Label htmlFor="size" className="text-base">
                            Select your size
                          </Label>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                              <Button
                                key={size}
                                type="button"
                                onClick={() => handleSizeChange(size)}
                                variant={
                                  selectedSize === size ? "default" : "outline"
                                }
                                className={`h-14 ${
                                  selectedSize === size
                                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                                    : "hover:bg-pink-50"
                                }`}
                              >
                                {size}
                              </Button>
                            ))}
                          </div>

                          {selectedSize && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                              <h4 className="font-medium text-sm mb-2">
                                Size {selectedSize} Measurements (inches)
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                                {Object.entries(
                                  SIZE_MEASUREMENTS[selectedSize]
                                ).map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between"
                                  >
                                    <span className="capitalize">{key}:</span>
                                    <span className="font-medium">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {measurementMode === "custom" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.keys(measurements).map((field) => (
                            <div key={field} className="space-y-2">
                              <Label
                                htmlFor={field}
                                className="capitalize flex items-center"
                              >
                                {field} (inches)
                                <span className="text-red-500 ml-1">*</span>
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
                                  measurementErrors[field]
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-pink-500"
                                }`}
                              />
                              {measurementErrors[field] && (
                                <p className="text-red-500 text-sm flex items-center">
                                  <AlertCircle size={12} className="mr-1" />
                                  {measurementErrors[field]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={goToNextTab}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-6"
                      >
                        Next <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
                    <h3 className="font-semibold text-lg mb-2 text-pink-800">
                      Design Details
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Customize your clothing with these design options
                    </p>

                    <div className="space-y-6">
                      <div>
                        <Label
                          htmlFor="style"
                          className="text-base flex items-center"
                        >
                          Style <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                          Choose the overall design style
                        </p>
                        <Select
                          value={design.style}
                          onValueChange={(value) =>
                            handleDesignChange("style", value)
                          }
                        >
                          <SelectTrigger
                            className={`${
                              designErrors.style
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:ring-pink-500`}
                          >
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="traditional">
                              Traditional
                            </SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="fusion">Fusion</SelectItem>
                            <SelectItem value="minimalist">
                              Minimalist
                            </SelectItem>
                            <SelectItem value="vintage">Vintage</SelectItem>
                          </SelectContent>
                        </Select>
                        {designErrors.style && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <AlertCircle size={12} className="mr-1" />
                            {designErrors.style}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="fabric"
                          className="text-base flex items-center"
                        >
                          Fabric Preference{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                          Select your preferred fabric type
                        </p>
                        <Select
                          value={design.fabric}
                          onValueChange={(value) =>
                            handleDesignChange("fabric", value)
                          }
                        >
                          <SelectTrigger
                            className={`${
                              designErrors.fabric
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:ring-pink-500`}
                          >
                            <SelectValue placeholder="Select fabric" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="silk">Silk</SelectItem>
                            <SelectItem value="linen">Linen</SelectItem>
                            <SelectItem value="wool">Wool</SelectItem>
                            <SelectItem value="polyester">
                              Polyester Blend
                            </SelectItem>
                            <SelectItem value="denim">Denim</SelectItem>
                            <SelectItem value="velvet">Velvet</SelectItem>
                          </SelectContent>
                        </Select>
                        {designErrors.fabric && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <AlertCircle size={12} className="mr-1" />
                            {designErrors.fabric}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="customization"
                          className="text-base flex items-center"
                        >
                          Special Requirements{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                          Describe any special customizations you need
                        </p>
                        <Textarea
                          id="customization"
                          value={design.customization}
                          onChange={(e) =>
                            handleDesignChange("customization", e.target.value)
                          }
                          placeholder="Describe any special requirements or customizations"
                          className={`h-32 ${
                            designErrors.customization
                              ? "border-red-500 focus:ring-red-500"
                              : "focus:ring-pink-500"
                          }`}
                        />
                        {designErrors.customization && (
                          <p className="text-red-500 text-sm flex items-center mt-1">
                            <AlertCircle size={12} className="mr-1" />
                            {designErrors.customization}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={goToNextTab}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-6"
                    >
                      Next <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="reference" className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
                    <h3 className="font-semibold text-lg mb-2 text-pink-800">
                      Reference Images
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload images that show your design inspiration
                    </p>

                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-pink-200 rounded-xl p-8 text-center hover:border-pink-400 transition-colors hover:bg-pink-50">
                        <Label
                          htmlFor="file-upload"
                          className="cursor-pointer block"
                        >
                          <div className="flex flex-col items-center">
                            <Image size={32} className="text-pink-500 mb-2" />
                            <span className="text-base font-medium mb-1">
                              Upload Reference Images
                            </span>
                            <span className="text-sm text-gray-500">
                              Drag and drop or click to browse
                            </span>
                          </div>
                          <Input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Upload up to 5 images (max 5MB each) to help us
                        understand your design preferences
                      </p>

                      {attachments.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">
                            Uploaded Images ({attachments.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {attachments.map((file, index) => (
                              <div
                                key={index}
                                className="relative group rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Reference ${index + 1}`}
                                  className="w-full h-40 object-contain"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                  {file.name}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(index)}
                                  className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                  aria-label="Remove image"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          Submit Order
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {(error || success) && (
                <div className="mt-8">
                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-red-50 border-red-200 text-red-800 animate-in fade-in duration-300"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </div>
  );
};

export default CustomCloth;
