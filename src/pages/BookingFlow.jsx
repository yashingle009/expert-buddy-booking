
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  Info
} from "lucide-react";

const BookingFlow = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [expert, setExpert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  
  // Get any preselected package from query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const packageId = queryParams.get("package");
    
    // Simulate API loading
    const timer = setTimeout(() => {
      const mockExpert = {
        id: expertId,
        name: "Dr. Sarah Johnson",
        specialty: "Tax Consultant",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        services: [
          { id: "1", name: "Basic Consultation", duration: "45 min", price: "$120", description: "Initial consultation to discuss your tax needs" },
          { id: "2", name: "Tax Planning Session", duration: "90 min", price: "$220", description: "Comprehensive tax planning and strategy session" },
          { id: "3", name: "Business Tax Package", duration: "3 hours", price: "$500", description: "Complete business tax analysis and optimization" },
        ],
        availability: [
          { day: "Monday", date: "Jun 12", formatted: "June 12, 2023", slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
          { day: "Tuesday", date: "Jun 13", formatted: "June 13, 2023", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
          { day: "Wednesday", date: "Jun 14", formatted: "June 14, 2023", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
          { day: "Thursday", date: "Jun 15", formatted: "June 15, 2023", slots: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"] },
          { day: "Friday", date: "Jun 16", formatted: "June 16, 2023", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
        ],
      };
      
      setExpert(mockExpert);
      setIsLoading(false);
      
      // If package ID was provided, preselect it
      if (packageId) {
        const pkg = mockExpert.services.find(s => s.id === packageId);
        if (pkg) {
          setSelectedService(pkg);
          setStep(2); // Skip to date selection
        }
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [expertId, location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    } else {
      navigate(-1);
    }
  };

  const confirmBooking = () => {
    // Simulate booking confirmation
    setIsBookingComplete(true);
    setTimeout(() => {
      navigate("/bookings");
    }, 3000);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Select Service";
      case 2:
        return "Choose Date & Time";
      case 3:
        return "Your Information";
      case 4:
        return "Review & Confirm";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-booking-secondary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (isBookingComplete) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 size={48} className="text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Your appointment with {expert.name} has been scheduled.
        </p>
        <div className="neo-card p-6 w-full max-w-md mb-8">
          <div className="flex items-center mb-4">
            <img 
              src={expert.image} 
              alt={expert.name} 
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-bold">{expert.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{expert.specialty}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <Package size={18} className="text-gray-500 mr-2" />
              <span>{selectedService.name} ({selectedService.duration})</span>
            </div>
            <div className="flex items-center">
              <Calendar size={18} className="text-gray-500 mr-2" />
              <span>{selectedDate?.formatted}</span>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="text-gray-500 mr-2" />
              <span>{selectedTime}</span>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Redirecting to your bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="page-container pb-20 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={prevStep}
          className="flex items-center text-booking-secondary mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
        <p className="text-gray-600 dark:text-gray-400">Booking with {expert.name}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div 
              key={stepNumber} 
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                stepNumber < step 
                  ? "bg-booking-secondary text-white" 
                  : stepNumber === step 
                    ? "bg-booking-secondary/20 text-booking-secondary border border-booking-secondary" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {stepNumber < step ? (
                <CheckCircle2 size={16} />
              ) : (
                <span className="text-xs">{stepNumber}</span>
              )}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full">
          <div 
            className="bg-booking-secondary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step - 1) * 33.33}%` }}
          ></div>
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8">
        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            {expert.services.map((service) => (
              <div 
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`neo-card p-6 cursor-pointer transition-all duration-200 ${
                  selectedService?.id === service.id 
                    ? "border-2 border-booking-secondary" 
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{service.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock size={14} className="mr-1" />
                      {service.duration}
                    </div>
                    <p className="mt-3 text-gray-700 dark:text-gray-300">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{service.price}</div>
                    <div className={`mt-4 w-6 h-6 rounded-full border-2 transition-all ${
                      selectedService?.id === service.id 
                        ? "bg-booking-secondary border-booking-secondary" 
                        : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {selectedService?.id === service.id && (
                        <CheckCircle2 size={22} className="text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Choose Date & Time */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="font-bold mb-4">Select a Date</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {expert.availability.map((day, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`neo-card p-4 flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    selectedDate === day ? "border-2 border-booking-secondary" : ""
                  }`}
                >
                  <span className="text-sm font-medium">{day.day}</span>
                  <span className="text-lg font-bold my-1">{day.date}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{day.slots.length} slots</span>
                </div>
              ))}
            </div>

            {selectedDate ? (
              <div>
                <h3 className="font-bold mb-4">Select a Time</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {selectedDate.slots.map((slot, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedTime(slot)}
                      className={`neo-card p-4 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        selectedTime === slot ? "border-2 border-booking-secondary" : ""
                      }`}
                    >
                      <Clock size={16} className="mr-2" />
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="neo-card p-6 flex flex-col items-center justify-center">
                <Calendar size={48} className="text-booking-secondary mb-2" />
                <h3 className="font-bold">Select a Date</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
                  Choose a date to see available time slots
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Your Information */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="neo-card p-6">
              <h3 className="font-bold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Your first name"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Your last name"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="neo-card p-6">
              <h3 className="font-bold mb-4">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any specific topics you'd like to discuss..."
                  className="input-field h-24 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="neo-card p-6">
              <h3 className="font-bold mb-4">Booking Summary</h3>
              
              <div className="flex items-center mb-6">
                <img 
                  src={expert.image} 
                  alt={expert.name} 
                  className="w-16 h-16 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-bold">{expert.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{expert.specialty}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Package size={20} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Service</div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {selectedService.name} ({selectedService.duration})
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar size={20} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Date & Time</div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {selectedDate?.formatted} at {selectedTime}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={20} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-gray-700 dark:text-gray-300">
                      Virtual Session
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User size={20} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Client</div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {formData.firstName} {formData.lastName}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {formData.email}<br />
                      {formData.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="neo-card p-6">
              <h3 className="font-bold mb-4">Payment Details</h3>
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-700 dark:text-gray-300">
                  {selectedService.name}
                </div>
                <div className="font-medium">
                  {selectedService.price}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="font-bold">Total</div>
                <div className="font-bold text-xl">
                  {selectedService.price}
                </div>
              </div>
            </div>
            
            <div className="neo-card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
              <div className="flex">
                <Info size={20} className="text-blue-600 dark:text-blue-400 mr-3 shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-800 dark:text-blue-300">Important Information</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    You'll receive a confirmation email with details to join the virtual session. 
                    Cancellation is free up to 24 hours before the appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-10">
        <div className="max-w-screen-xl mx-auto flex justify-between">
          <button 
            onClick={prevStep}
            className="btn-secondary py-3 px-6 flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={nextStep}
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && (!selectedDate || !selectedTime)) ||
                (step === 3 && (!formData.firstName || !formData.lastName || !formData.email))
              }
              className={`btn-primary py-3 px-6 flex items-center ${
                (step === 1 && !selectedService) ||
                (step === 2 && (!selectedDate || !selectedTime)) ||
                (step === 3 && (!formData.firstName || !formData.lastName || !formData.email))
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Continue
              <ArrowRight size={18} className="ml-2" />
            </button>
          ) : (
            <button 
              onClick={confirmBooking}
              className="btn-primary py-3 px-6 flex items-center"
            >
              <CreditCard size={18} className="mr-2" />
              Confirm & Pay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
