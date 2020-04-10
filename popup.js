document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', onClickHandler);
  $('#reportTable').hide();

  function onClickHandler() {
    chrome.tabs.query({currentWindow: true, active: true},
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'hi', responseHandler);
      })
  }

  function responseHandler(jobs) {
    console.log('handle');
    //   $('#reportTable').show();
    //
    // jobs.forEach(job => {
    //   const tr = document.createElement('tr');
    //   for (let [key, value] of Object.entries(job)) {
    //     const td = document.createElement('td');
    //     td.innerHTML = value;
    //     tr.appendChild(td);
    //   }
    //   $('#tbody:last').append(tr);
    // })
    //
    // $('#reportTable').tableExport({
    //   format: 'csv',
    //   fileName: 'test',
    // });
    //
    // $('#reportTable').hide();
  }
})
