const selectors = {
  jobName: "h2.jobs-details-top-card__job-title",
  // href
  jobUrl: "a.jobs-details-top-card__job-title-link",
  //href , innerText
  company: "a.jobs-details-top-card__company-url",
  //innerText
  location: "span.jobs-details-top-card__bullet",
  postedOn: "p.jobs-details-top-card__job-info span",
  amountOfViews: "p.jobs-details-top-card__job-info span.jobs-details-top-card__bullet",
  jobDetailsContainer: "span.jobs-details-job-summary__text--ellipsis",
  amountOfApplicants: "jobDetailsContainer[0]",
  seniority: "jobDetailsContainer[1]",
  amountOfEmployees: "jobDetailsContainer[2]",
  jobDescription: "div.jobs-box__html-content > span",
  employmentType: "p.jobs-box__body.js-formatted-employment-status-body",
  jobFunction: "ul.jobs-box__list.jobs-description-details__list.js-formatted-job-functions-list",
  industry: "ul.jobs-box__list.jobs-description-details__list.js-formatted-industries-list",
  followers: "span.jobs-company-information__follow-count.inline",
};

const selectorJobs = 'li.occludable-update.artdeco-list__item--offset-4'
const selectorJobContainer = 'div.jobs-search-results'
const selectorPaginationContainer = 'ul.artdeco-pagination__pages';
const selectorLastPagination = `ul.artdeco-pagination__pages>li:last-child`


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  let jobStore = [];

  const containerJobs = $(selectorJobContainer)[0];
  const heightBlock = $(selectorJobs)[0].clientHeight;
  const amountTabs = Number($(selectorLastPagination)[0].innerText);
  try {


    for (let i = 1; i < 2; i++) {
      let scrollFromTop = heightBlock;
      let jobs = $(selectorJobs);

      for (let j = 0; j < jobs.length; j++) {
        let idDiv = `#${jobs[j].children[0].id}`;

        if (j % 6 === 0 && j !== 0 && j !== 24) {
          await sleep(3000);
        }
        let jobName = getAttr($(selectors.jobName)[0], "innerText");
        let jobUrl = getAttr($(selectors.jobUrl)[0], "href");
        let company = $(selectors.company)[0];
        let companyName = getAttr(company, "innerText");
        let companyUrl = getAttr(company, "href");
        let location = getAttr($(selectors.location)[0], "innerText");
        let postedOn = getAttr($(selectors.postedOn)[0], "innerText");
        let amountOfViews = getAttr($(selectors.amountOfViews)[0], "innerText");
        let jobDetailsContainer = document.querySelectorAll(selectors.jobDetailsContainer);
        let {amountOfApplicants, seniority, amountOfEmployees, jobLocation} = findAplSenEmp(jobDetailsContainer)
        let jobDescription = getAttr($(selectors.jobDescription)[0], "innerText");
        let employmentType = getAttr($(selectors.employmentType)[0], "innerText");
        let jobFunction = getAttr($(selectors.jobFunction)[0], "innerText");
        let industry = getAttr($(selectors.industry)[0], "innerText");
        let followers = getAttr($(selectors.followers)[0], "innerText");

        let job = {
          jobName,
          jobUrl,
          companyName: companyName.trim(),
          companyUrl,
          location: location.trim(),
          fullField: companyName + " " + location,
          postedOn: cutUsefullInformation(postedOn),
          amountOfViews: cutUsefullInformation(amountOfViews),
          amountOfApplicants,
          seniority,
          amountOfEmployees,
          jobLocation,
          // jobDescription,
          employmentType,
          jobFunction,
          industry,
          followers
        };

        containerJobs.scrollTo(0, scrollFromTop)
        scrollFromTop += heightBlock;

        jobStore.push(job);
        $(idDiv)[0].click();
      }

      $('li.artdeco-pagination__indicator.active')[0].nextElementSibling.firstElementChild.click();
      await sleep(3000);

    }
  } finally {
    exportToCsv('export.csv', jobStore);
  }

  // sendResponse(jobStore);
});

function cutUsefullInformation(str) {
  if (!str) {
    return "";
  }
  const {index} = str.match(/\d/);
  return str.slice(index);
}

function findAplSenEmp(jobDetailsContainer) {
  let amountOfApplicants = '', seniority = '', amountOfEmployees = '', jobLocation = '';
  for (let i = 0; i < jobDetailsContainer.length; i++) {
    const text = jobDetailsContainer[i].innerText;
    if (text.match('employees')) {
      amountOfEmployees = text
    }
    if (text.match('level')) {
      seniority = text;
    }
    if (text.match('applicants')) {
      amountOfApplicants = text;
    } else {
      jobLocation = text;
    }
  }
  return {amountOfApplicants, seniority, amountOfEmployees, jobLocation};
}

function getAttr(domElement, attr) {
  if (attr === 'innerText') {
    // delete double space from text
    return domElement ? domElement[attr].replace(/ +/g, ' ').trim() : "";
  }
  return domElement ? domElement[attr] : "";
}

function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s));
}

function exportToCsv(filename, rows) {
  const processRow = function (row) {
    let finalVal = '';
    let count = 0;
    for (let [key, value] of Object.entries(row)) {
      if (count > 0) {
        finalVal += ',';
      }
      finalVal += value;
      count++;
    }
    return finalVal + '\n';
  };

  let csvFile = '';
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
  const link = document.createElement("a");
  if (link.download !== undefined) { // feature detection
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
