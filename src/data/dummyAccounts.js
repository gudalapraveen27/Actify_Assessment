const companies = [
  'Northstar Labs','Bluebird Health','Cedar & Stone','Orbit Financial','Brightpath Education','Summit Logistics','Evergreen Energy','Copperline Media','Meridian Foods','Cloudline Systems',
  'Silver Oak Realty','Atlas Manufacturing','Kindred Commerce','Pioneer Mobility','Lighthouse Legal','Willow Creek Group','Nova Creative','Redwood Analytics','TrueNorth Security','Harborview Hotels',
  'Juniper Works','Clearwater Insurance','Golden Hour Studios','Ironwood Construction','Sprout & Co.','Vertex Telecommunications','Solstice Travel','Beacon Biotech','Fieldstone Capital','Mosaic Retail',
  'Blue Ridge Consulting','Daybreak Wellness','Arbor Automotive','Pixelcraft Design','Sequoia Supply','Cobalt Aerospace','Openroad Transit','Kindred Learning','Crescent Care','Wildflower Agriculture',
  'Anchorpoint Software','Fable Publishing','Westward Shipping','Hearthside Interiors','Neon Peak Entertainment','Sundial Research','Marigold Hospitality','Cloudcrest Networks','Tandem Robotics','Lumen Waterworks',
  'Elm Street Dental','Aster Pharmaceuticals','Stonegate Partners','Rivermark Apparel','Fireside Brewing','Highland Renewables','Pocketful Payments','Granite Peak Mining','Goodwell Nutrition','Compass Architecture'
];
const industries = ['Technology','Healthcare','Finance','Education','Manufacturing','Retail','Energy','Logistics','Professional Services','Media'];
const remarks = ['Expanding into new markets','Quarterly review scheduled','Interested in enterprise plan','Long-standing partner','Follow up next month','New opportunity identified','Renewal in progress','Met at industry conference','Onboarding underway',''];
const statuses = ['Active','Active','Active','Prospect','Pending','Inactive'];

export const dummyAccounts = companies.map((name, i) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    id: `acct-${String(i + 1).padStart(3, '0')}`, name,
    email: `hello@${slug}.com`, phone: `+1 (555) ${String(200 + i).padStart(3, '0')}-${String(1000 + i * 37).slice(-4)}`,
    website: `https://www.${slug}.com`, industry: industries[i % industries.length],
    status: statuses[i % statuses.length], remark: remarks[i % remarks.length]
  };
});

export const industriesList = industries;
export const statusesList = ['Active','Prospect','Pending','Inactive'];
