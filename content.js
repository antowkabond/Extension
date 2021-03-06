const headerReport = {
  jobName: "Job Name",
  jobUrl: "Job Url",
  company: "Company",
  companyUrl: "Company URL",
  location: "Location",
  fullField: "Full Field",
  postedOn: "Posted On",
  amountOfViews: "Amount of Views",
  amountOfApplicants: "Amount of Applicants",
  seniority: "Seniority",
  amountOfEmployees: "Amount of Employees",
  jobLocation: "Job Location",
  // description: "Description",
  employmentType: "Employment Type",
  jobFunction: "Job Functions",
  industry: "Industry",
  applicantsPastDay: 'Applicants in the past day',
  seniorityApplicants: "Seniority of Applicants",
  educationApplicants: "Education of Applicants",
  locationApplicants: "Location of Applicants",
  companyGrowth: "Company Growth",
  followers: "Followers",
}

const selectors = {
  jobName: "h2.jobs-details-top-card__job-title",
  jobUrl: "a.jobs-details-top-card__job-title-link",
  company: "a.jobs-details-top-card__company-url",
  location: "span.jobs-details-top-card__bullet",
  postedOn: "p.jobs-details-top-card__job-info span",
  amountOfViews: "p.jobs-details-top-card__job-info span.jobs-details-top-card__bullet",
  jobDetailsContainer: "span.jobs-details-job-summary__text--ellipsis",
  jobDescription: "div.jobs-box__html-content > span",
  employmentType: "p.jobs-box__body.js-formatted-employment-status-body",
  jobFunction: "ul.jobs-box__list.jobs-description-details__list.js-formatted-job-functions-list",
  industry: "ul.jobs-box__list.jobs-description-details__list.js-formatted-industries-list",
  premiumInfoContainer: "ul.jobs-details-premium-insight__list",
  applicantsPastDay: "premiumInfoContainer[0]",
  seniorityApplicants: "premiumInfoContainer[1]",
  educationApplicants: "premiumInfoContainer[2]",
  locationApplicants: "premiumInfoContainer[3]",
  companyGrowth: "li.jobs-premium-company-growth__stat-item.ph5",
  followers: "span.jobs-company-information__follow-count.inline",


  jobs: 'li.occludable-update.artdeco-list__item--offset-4',
  jobsContainer: 'div.jobs-search-results',
  lastPagination: 'ul.artdeco-pagination__pages>li:last-child',
  panelDetails: 'div.jobs-search-two-pane__details'
};


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  let jobStore = [];
  jobStore.push(headerReport);

  const containerJobs = $(selectors.jobsContainer)[0];
  const panelDetails = $(selectors.panelDetails)[0];
  const heightBlock = $(selectors.jobs)[0].clientHeight;
  const amountTabs = Number(getAttr($(selectors.lastPagination)[0], "innerText")) || 2;

  try {
    for (let i = 1; i <= amountTabs; i++) {
      let scrollFromTop = heightBlock;
      let jobs = $(selectors.jobs);


      for (let j = 1; j < jobs.length; j++) {
        let idDiv = `#${jobs[j].children[0].id}`;

        // Scroll panel job detail
        await sleep(0, 3);
        const scrollBy = panelDetails.scrollHeight - randomFromInterval(0, 800)
        panelDetails.scrollTo(0, scrollBy)
        await sleep(1, 7);

        let jobName = getAttr($(selectors.jobName)[0], "innerText");
        let jobUrl = getAttr($(selectors.jobUrl)[0], "href");
        let company = $(selectors.company)[0];
        let companyName = getAttr(company, "innerText");
        let companyUrl = getAttr(company, "href");
        let location = getAttr($(selectors.location)[0], "innerText");
        let postedOn = getAttr($(selectors.postedOn)[0], "innerText");
        let amountOfViews = getAttr($(selectors.amountOfViews)[0], "innerText");

        let jobDetailsContainer = document.querySelectorAll(selectors.jobDetailsContainer);
        let {amountOfApplicants, seniority, amountOfEmployees, jobLocation} = getJobDetails(jobDetailsContainer)

        // let jobDescription = getAttr($(selectors.jobDescription)[0], "innerText");
        let employmentType = getAttr($(selectors.employmentType)[0], "innerText");
        let jobFunction = getAttr($(selectors.jobFunction)[0], "innerText");
        let industry = getAttr($(selectors.industry)[0], "innerText");

        let premiumInfoContainer = document.querySelectorAll(selectors.premiumInfoContainer);
        let {seniorityApplicants, educationApplicants, locationApplicants, applicantsPastDay} = getPremiumDetails(premiumInfoContainer);

        let companyGrowth = removeEnter(getAttr($(selectors.companyGrowth)[0], "innerText"));
        let followers = getAttr($(selectors.followers)[0], "innerText");

        let job = {
          jobName,
          jobUrl,
          companyName: companyName.trim(),
          companyUrl,
          location: location.trim(),
          fullField: companyName + " " + location,
          postedOn: cutUsefulInformation(postedOn),
          amountOfViews: cutUsefulInformation(amountOfViews),
          amountOfApplicants,
          seniority,
          amountOfEmployees,
          jobLocation,
          // jobDescription,
          employmentType,
          jobFunction,
          industry,
          applicantsPastDay,
          seniorityApplicants,
          educationApplicants,
          locationApplicants,
          companyGrowth,
          followers
        };

        //Scroll job container
        containerJobs.scrollTo(0, scrollFromTop);
        scrollFromTop += heightBlock;

        jobStore.push(job);
        //Click on job
        $(idDiv)[0].click();
      }

      //Click on pagination
      $('li.artdeco-pagination__indicator.active')[0].nextElementSibling.firstElementChild.click();
      await sleep(1,6);

    }
  } finally {
    exportToCsv('export.csv', jobStore);
  }
});

function cutUsefulInformation(str) {
  if (!str) {
    return "";
  }
  const {index} = str.match(/\d/);
  return str.slice(index);
}

function getJobDetails(jobDetailsContainer) {
  let amountOfApplicants = '', seniority = '', amountOfEmployees = '', jobLocation = '';

  jobDetailsContainer.forEach(jobDetail => {
    const text = jobDetail.innerText;
    if (text.match('employees')) {
      amountOfEmployees = text
    } else if (text.match('level')) {
      seniority = text;
    } else if (text.match('applicants')) {
      amountOfApplicants = text;
    } else {
      jobLocation = text;
    }
  })

  return {amountOfApplicants, seniority, amountOfEmployees, jobLocation};
}

function getPremiumDetails(premiumInfoContainer) {
  let seniorityApplicants = '', educationApplicants = '', locationApplicants = '', applicantsPastDay = '';

  if (premiumInfoContainer.length === 0) {
    return {seniorityApplicants, educationApplicants, locationApplicants, applicantsPastDay};
  }

  seniorityApplicants = removeEnter(getAttr(premiumInfoContainer[1], "innerText"))
  const educationContainer = premiumInfoContainer[2];
  const locationContainer = premiumInfoContainer[3];

  let ulApplicant = premiumInfoContainer[0];

  if (ulApplicant.childElementCount > 1) {
    const strApl = getInfoFromPremiumList(ulApplicant.lastElementChild);
    if (!strApl.match('past')) {
      applicantsPastDay = '';
    } else {
      applicantsPastDay = strApl.trim();
    }
  }

  if (educationContainer) {
    [].forEach.call(educationContainer.children, function (li) {
      educationApplicants += getInfoFromPremiumList(li);
    });
  }

  if (locationContainer) {
    [].forEach.call(locationContainer.children, function (li) {
      locationApplicants += getInfoFromPremiumList(li);
    });
  }


  return {seniorityApplicants, educationApplicants, locationApplicants, applicantsPastDay};
}

function getInfoFromPremiumList(li) {
  return `${li.firstElementChild.innerText} ${li.lastElementChild.innerText}. `;
}

function removeEnter(str) {
  return str.replace(/(\r\n|\n|\r)/gm, " ");
}

function getAttr(domElement, attr) {
  if (attr === 'innerText') {
    return domElement ? domElement[attr].trim() : "";
  }
  return domElement ? domElement[attr] : "";
}

function sleep(from, to) {
  let s = 0;
  if (!s) {
    s = randomFromInterval(2, 5);
  } else {
    s = randomFromInterval(from, to);
  }
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}

function exportToCsv(filename, rows) {
  const processRow = row => Object.values(row).map(row => row.replace(/,/g, '.')).join(',') + '\n';

  let csvFile = rows.reduce((accumulator, row) => accumulator + processRow(row), '');

  const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url)
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function randomFromInterval(min, max) {
  return Math.random() * (max - min) + min;
}

// window.addEventListener("beforeunload", function (event) {
//   event.preventDefault();
//   event.returnValue = '';
//
//   if (jobStore.length > 0) {
//     exportToCsv('export.csv', jobStore);
//     jobStore = [];
//   }
// });
