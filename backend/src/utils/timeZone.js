
//TODO: Keep this in config folder/file
export const TIMEZONES = [
    {
        abbreviation: "ET",
        name: "Eastern Time",
        iana: "America/New_York"
    },
    {
        abbreviation: "CT",
        name: "Central Time",
        iana: "America/Chicago"
    },
    {
        abbreviation: "MT",
        name: "Mountain Time",
        iana: "America/Denver"
    },
    {
        abbreviation: "PT",
        name: "Pacific Time",
        iana: "America/Los_Angeles"
    },
    {
        abbreviation: "AKT",
        name: "Alaska Time",
        iana: "America/Anchorage"
    },
    {
        abbreviation: "HT",
        name: "Hawaii Time",
        iana: "Pacific/Honolulu"
    },
    {
        abbreviation: "GMT",
        name: "Greenwich Mean Time",
        iana: "Europe/London"
    },
    {
        abbreviation: "CET",
        name: "Central European Time",
        iana: "Europe/Paris"
    },
    {
        abbreviation: "EET",
        name: "Eastern European Time",
        iana: "Europe/Athens"
    },

    {
        abbreviation: "IST",
        name: "India Standard Time",
        iana: "Asia/Kolkata"
    },
    {
        abbreviation: "CST",
        name: "China Standard Time",
        iana: "Asia/Shanghai"
    },
    {
        abbreviation: "JST",
        name: "Japan Standard Time",
        iana: "Asia/Tokyo"
    },
    {
        abbreviation: "KST",
        name: "Korea Standard Time",
        iana: "Asia/Seoul"
    },
    {
        abbreviation: "SGT",
        name: "Singapore Time",
        iana: "Asia/Singapore"
    },

    {
        abbreviation: "AEST",
        name: "Australian Eastern Time",
        iana: "Australia/Sydney"
    },
    {
        abbreviation: "ACST",
        name: "Australian Central Time",
        iana: "Australia/Adelaide"
    },
    {
        abbreviation: "AWST",
        name: "Australian Western Time",
        iana: "Australia/Perth"
    },

    {
        abbreviation: "UTC",
        name: "Coordinated Universal Time",
        iana: "UTC"
    },
    {
        abbreviation: "BRT",
        name: "Brazil Time",
        iana: "America/Sao_Paulo"
    },
    {
        abbreviation: "ART",
        name: "Argentina Time",
        iana: "America/Argentina/Buenos_Aires"
    },
    {
        abbreviation: "NZST",
        name: "New Zealand Time",
        iana: "Pacific/Auckland"
    },
    {
        abbreviation: "MSK",
        name: "Moscow Time",
        iana: "Europe/Moscow"
    },
    {
        abbreviation: "GST",
        name: "Gulf Standard Time",
        iana: "Asia/Dubai"
    },
    {
        abbreviation: "PKT",
        name: "Pakistan Time",
        iana: "Asia/Karachi"
    },
    {
        abbreviation: "WIB",
        name: "Western Indonesia Time",
        iana: "Asia/Jakarta"
    }
];



export const TIMEZONE_MAP = new Map(
    TIMEZONES.map(tz => [
        `${tz.name} (${tz.abbreviation})`,
        tz.iana
    ])

);

export const getTimezoneInfo = (abbreviation) => {
    return TIMEZONE_MAP.get(abbreviation) || null;
};

