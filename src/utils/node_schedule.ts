/* import * as schedule from 'node-schedule';

// Function to run the campaign job
function runCampaignJob() {
  // Your campaign activities code goes here
  console.log('Campaign job is running...');
}

// Get the start and end dates from your input or configuration
const startDate: Date = new Date('2023-07-30T00:00:00Z');
const endDate: Date = new Date('2023-08-10T00:00:00Z');

// Schedule the job to run between the start and end dates
const campaignJob: schedule.Job = schedule.scheduleJob(
  { start: startDate, end: endDate },
  runCampaignJob
);

// Handle stopping the campaign once it ends
campaignJob.on('end', () => {
  console.log('Campaign has ended. Stopping the job.');
  campaignJob.cancel();
});
 */
