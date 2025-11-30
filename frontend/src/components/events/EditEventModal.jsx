import React, { useState, useEffect } from "react";
import { useUserStore } from "../../store/userStore.js";
import { useEventStore } from "../../store/eventStore.js";
import { useTimezones } from "../../hooks/useTimezones.js";
import ProfileSelector from "./ProfileSelector.jsx";
import DateTimePicker from "./DateTimePicker.jsx";
import dayjs from '../../utils/dateUtils.js';
import "./EditEventModal.css";

// Mapping from display labels to IANA timezone IDs
// This must match the backend's TIMEZONE_MAP format: "Name (Abbreviation)" -> IANA ID
const TIMEZONE_LABEL_TO_ID = {
    'Eastern Time (ET)': 'America/New_York',
    'Central Time (CT)': 'America/Chicago',
    'Mountain Time (MT)': 'America/Denver',
    'Pacific Time (PT)': 'America/Los_Angeles',
    'Alaska Time (AKT)': 'America/Anchorage',
    'Hawaii Time (HT)': 'Pacific/Honolulu',
    'Greenwich Mean Time (GMT)': 'Europe/London',
    'Central European Time (CET)': 'Europe/Paris',
    'Eastern European Time (EET)': 'Europe/Athens',
    'India Standard Time (IST)': 'Asia/Kolkata',
    'China Standard Time (CST)': 'Asia/Shanghai',
    'Japan Standard Time (JST)': 'Asia/Tokyo',
    'Korea Standard Time (KST)': 'Asia/Seoul',
    'Singapore Time (SGT)': 'Asia/Singapore',
    'Australian Eastern Time (AEST)': 'Australia/Sydney',
    'Australian Central Time (ACST)': 'Australia/Adelaide',
    'Australian Western Time (AWST)': 'Australia/Perth',
    'Coordinated Universal Time (UTC)': 'UTC',
    'Brazil Time (BRT)': 'America/Sao_Paulo',
    'Argentina Time (ART)': 'America/Argentina/Buenos_Aires',
    'New Zealand Time (NZST)': 'Pacific/Auckland',
    'Moscow Time (MSK)': 'Europe/Moscow',
    'Gulf Standard Time (GST)': 'Asia/Dubai',
    'Pakistan Time (PKT)': 'Asia/Karachi',
    'Western Indonesia Time (WIB)': 'Asia/Jakarta',
};

// Reverse mapping: IANA ID to display label
const TIMEZONE_ID_TO_LABEL = Object.fromEntries(
    Object.entries(TIMEZONE_LABEL_TO_ID).map(([label, id]) => [id, label])
);

// Helper function to get display label from IANA timezone ID
const getTimezoneLabel = (timezoneId) => {
    if (!timezoneId) return '';
    // If it's already a label (contains parentheses), return it
    if (timezoneId.includes('(') && timezoneId.includes(')')) {
        return timezoneId;
    }
    // Otherwise, convert IANA ID to label
    return TIMEZONE_ID_TO_LABEL[timezoneId] || timezoneId;
};

// Helper function to get IANA timezone ID from label or ID
const getTimezoneId = (timezoneValue) => {
    if (!timezoneValue) return dayjs.tz.guess();
    
    // If it's already a valid IANA ID (contains '/'), return it
    if (timezoneValue.includes('/')) {
        return timezoneValue;
    }
    
    // Otherwise, try to map from label to ID
    return TIMEZONE_LABEL_TO_ID[timezoneValue] || dayjs.tz.guess();
};

const EditEventModal = ({ event, isOpen, onClose, onEventUpdated }) => {
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [selectedTimezone, setSelectedTimezone] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { users, fetchUsers } = useUserStore();
    const { updateEvent, error, clearError } = useEventStore();
    const { timezones } = useTimezones();

    // Initialize form with event data
    useEffect(() => {
        // Fetch users when modal opens if not loaded
        if (isOpen && users.length === 0) {
            fetchUsers();
        }
    }, [isOpen, users.length, fetchUsers]);

    // Set timezone and dates when modal opens (doesn't depend on users)
    useEffect(() => {
        if (event && isOpen) {
            // Set timezone directly (backend now stores display label)
            setSelectedTimezone(event.timeZone || "");

            // Set dates and times
            try {
                // Get the IANA timezone ID for date conversion
                const tzId = getTimezoneId(event.timeZone);
                
                if (event.startTime) {
                    // Convert UTC to event timezone for display
                    const startDateTime = dayjs(event.startTime).tz(tzId);
                    if (startDateTime.isValid()) {
                        setStartDate(startDateTime.format('YYYY-MM-DD'));
                        setStartTime(startDateTime.format('HH:mm'));
                    }
                }

                if (event.endTime) {
                    // Convert UTC to event timezone for display
                    const endDateTime = dayjs(event.endTime).tz(tzId);
                    if (endDateTime.isValid()) {
                        setEndDate(endDateTime.format('YYYY-MM-DD'));
                        setEndTime(endDateTime.format('HH:mm'));
                    }
                }
            } catch (e) {
                console.error("Error parsing event dates:", e);
            }
        }
    }, [event, isOpen]);

    // Populate profiles when event, modal, and users are available
    useEffect(() => {
        if (event && isOpen && users.length > 0) {
            // Set profiles - handle both populated objects and IDs
            const eventProfiles =
                event.profiles?.map((profile) => {
                // If profile is already an object (populated), use it directly
                if (typeof profile === 'object' && profile._id) {
                    return profile;
                }
                
                // If profile is just an ID string, find the user
                const user = users?.find((user) => user._id === profile);
                return (
                    user || {
                    _id: profile,
                    username: 'Unknown User', // Fallback username
                    }
                );
                }) || [];
            setSelectedProfiles(eventProfiles);
        }
    }, [event, isOpen, users]);

    // Validation helper
    const validateDateTime = () => {
        if (!startDate || !startTime || !endDate || !endTime) {
        return { isValid: false, message: 'Please fill in all date and time fields' };
        }

        // Get IANA timezone ID for validation
        const tzId = getTimezoneId(selectedTimezone);
        
        // Construct dates in the selected timezone
        const startDateTime = dayjs.tz(`${startDate} ${startTime}`, tzId);
        const endDateTime = dayjs.tz(`${endDate} ${endTime}`, tzId);

        if (endDateTime.isBefore(startDateTime) || endDateTime.isSame(startDateTime)) {
        return { isValid: false, message: 'End time must be after start time' };
        }

        // Check if the time difference is at least 15 minutes
        const timeDiff = endDateTime.diff(startDateTime, 'minute');
        if (timeDiff < 15) {
        return { isValid: false, message: 'Event must be at least 15 minutes long' };
        }

        return { isValid: true, message: '' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check validation without popups - let inline validation show errors
        if (selectedProfiles.length === 0 || !selectedTimezone) {
        return; // Don't submit, let user see the validation messages
        }

        const validation = validateDateTime();
        if (!validation.isValid) {
        return; // Don't submit, let user see the validation messages
        }

        // Get IANA timezone ID for submission
        const tzId = getTimezoneId(selectedTimezone);
        
        // Construct dates in the selected timezone and convert to UTC
        const startDateTime = dayjs.tz(`${startDate} ${startTime}`, tzId);
        const endDateTime = dayjs.tz(`${endDate} ${endTime}`, tzId);

        setIsSubmitting(true);
        clearError();

        try {
        await updateEvent(event._id, {
            profiles: selectedProfiles.map((p) => p._id),
            timeZone: selectedTimezone,
            startTime: startDateTime.utc().format(),
            endTime: endDateTime.utc().format(),
        });

        onEventUpdated?.();
        } catch (error) {
        console.error("Failed to update event:", error);
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        clearError();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
        <div
            className="modal-content edit-modal"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="modal-header">
            <h2 className="modal-title">Edit Event</h2>
            <button className="modal-close" onClick={handleClose}>
                ×
            </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-section">
                <label className="form-label">Profiles</label>
                <ProfileSelector
                users={users}
                selectedProfiles={selectedProfiles}
                onSelectionChange={setSelectedProfiles}
                />
                {selectedProfiles.length === 0 && (
                <div className="datetime-validation">
                    <span className="validation-error">⚠ Please select at least one profile</span>
                </div>
                )}
            </div>

            <div className="form-section">
                <label className="form-label">Timezone</label>
                <select
                className="form-select"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                required
                >
                <option value="">Select timezone...</option>
                {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                    {tz}
                    </option>
                ))}
                </select>
                {!selectedTimezone && (
                <div className="datetime-validation">
                    <span className="validation-error">⚠ Please select a timezone</span>
                </div>
                )}
            </div>

            <div className="form-section">
                <label className="form-label">Start Date & Time</label>
                <DateTimePicker
                date={startDate}
                time={startTime}
                onDateChange={setStartDate}
                onTimeChange={setStartTime}
                />
            </div>

            <div className="form-section">
                <label className="form-label">End Date & Time</label>
                <DateTimePicker
                date={endDate}
                time={endTime}
                onDateChange={setEndDate}
                onTimeChange={setEndTime}
                />
                {startDate && startTime && endDate && endTime && (
                <div className="datetime-validation">
                    {(() => {
                    const validation = validateDateTime();
                    return validation.isValid ? (
                        <span className="validation-success">✓ Valid time range</span>
                    ) : (
                        <span className="validation-error">⚠ {validation.message}</span>
                    );
                    })()}
                </div>
                )}
            </div>

            <div className="modal-actions">
                <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
                >
                Cancel
                </button>
                <button
                type="submit"
                className="btn btn-primary"
                disabled={
                    isSubmitting || 
                    selectedProfiles.length === 0 || 
                    !selectedTimezone || 
                    !validateDateTime().isValid
                }
                >
                {isSubmitting ? "Updating Event..." : "Update Event"}
                </button>
            </div>
            </form>
        </div>
        </div>
);
};

export default EditEventModal;
