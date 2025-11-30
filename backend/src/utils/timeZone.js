
//TODO: Keep this in config folder/file
export const TIMEZONES = [
    {
        name: "Eastern Time (ET)",
        iana: "America/New_York"
    },
    {
        name: "Central Time (CT)",
        iana: "America/Chicago"
    },
    {
        name: "Mountain Time (MT)",
        iana: "America/Denver"
    },
    {
        name: "Pacific Time (PT)",
        iana: "America/Los_Angeles"
    },
    {
        name: "Alaska Time (AKT)",
        iana: "America/Anchorage"
    },
    {
        name: "Hawaii Time (HT)",
        iana: "Pacific/Honolulu"
    },
    {
        name: "Greenwich Mean Time (GMT)",
        iana: "Europe/London"
    },
    {
        name: "Central European Time (CET)",
        iana: "Europe/Paris"
    },
    {
        name: "Eastern European Time (EET)",
        iana: "Europe/Athens"
    },
    {
        name: "India Standard Time (IST)",
        iana: "Asia/Kolkata"
    },
    {
        name: "China Standard Time (CST)",
        iana: "Asia/Shanghai"
    },
    {
        name: "Japan Standard Time (JST)",
        iana: "Asia/Tokyo"
    },
    {
        name: "Korea Standard Time (KST)",
        iana: "Asia/Seoul"
    },
    {
        name: "Singapore Time (SGT)",
        iana: "Asia/Singapore"
    },
    {
        name: "Australian Eastern Time (AEST)",
        iana: "Australia/Sydney"
    },
    {
        name: "Australian Central Time (ACST)",
        iana: "Australia/Adelaide"
    },
    {
        name: "Australian Western Time (AWST)",
        iana: "Australia/Perth"
    },
    {
        name: "Coordinated Universal Time (UTC)",
        iana: "UTC"
    },
    {
        name: "Brazil Time (BRT)",
        iana: "America/Sao_Paulo"
    },
    {
        name: "Argentina Time (ART)",
        iana: "America/Argentina/Buenos_Aires"
    },
    {
        name: "New Zealand Time (NZST)",
        iana: "Pacific/Auckland"
    },
    {
        name: "Moscow Time (MSK)",
        iana: "Europe/Moscow"
    },
    {
        name: "Gulf Standard Time (GST)",
        iana: "Asia/Dubai"
    },
    {
        name: "Pakistan Time (PKT)",
        iana: "Asia/Karachi"
    },
    {
        name: "Western Indonesia Time (WIB)",
        iana: "Asia/Jakarta"
    }
];



export const TIMEZONE_MAP = new Map(
    TIMEZONES.map(tz => [
        tz.name,
        tz.iana
    ])
);

export const getTimezoneInfo = (timezoneName) => {
    return TIMEZONE_MAP.get(timezoneName) || null;
};

