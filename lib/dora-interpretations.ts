import type { DORALevel } from './types';

type DORAInterpretation = {
  interpretation: string;
  recommendation: string;
};

type MetricKey = 'deploymentFrequency' | 'leadTimeForChanges' | 'changeFailureRate' | 'mttr';

export const DORA_INTERPRETATIONS: Record<MetricKey, Record<DORALevel, DORAInterpretation>> = {
  deploymentFrequency: {
    elite: {
      interpretation: 'Deploys on-demand, multiple times per day. The team has a highly automated and reliable deployment pipeline.',
      recommendation: 'Keep optimizing the pipeline and share best practices with other teams.',
    },
    high: {
      interpretation: 'Deploys between once per day and once per week. Good deployment cadence with room for improvement.',
      recommendation: 'Automate remaining manual steps in the deployment process to increase frequency.',
    },
    medium: {
      interpretation: 'Deploys between once per week and once per month. Deployments happen regularly but not frequently.',
      recommendation: 'Reduce batch sizes and work on smaller, more frequent merges to main.',
    },
    low: {
      interpretation: 'Deploys less than once per month. Large batches of changes accumulate before deployment.',
      recommendation: 'Consider smaller, more frequent merges to main. Break down large features into incremental deliverables.',
    },
  },
  leadTimeForChanges: {
    elite: {
      interpretation: 'Less than one hour from commit to deploy. Changes flow through the pipeline almost instantly.',
      recommendation: 'Maintain current practices and ensure new team members follow the same workflow.',
    },
    high: {
      interpretation: 'Between one hour and one day. Changes reach production relatively quickly.',
      recommendation: 'Identify bottlenecks in code review or CI/CD that could be optimized.',
    },
    medium: {
      interpretation: 'Between one day and one week. There is noticeable delay from code to deployment.',
      recommendation: 'Break work into smaller branches and consider async code reviews to reduce wait time.',
    },
    low: {
      interpretation: 'More than one week from commit to deploy. Significant delays in the delivery pipeline.',
      recommendation: 'Split work into smaller branches, reduce PR size, and streamline the review process.',
    },
  },
  changeFailureRate: {
    elite: {
      interpretation: 'Less than 5% of changes cause failures. Very few changes require hotfixes or rollbacks.',
      recommendation: 'Continue with current quality practices and testing strategies.',
    },
    high: {
      interpretation: 'Between 5% and 10% of changes cause failures. Good quality with occasional issues.',
      recommendation: 'Review recent failures for patterns and add targeted tests for common failure modes.',
    },
    medium: {
      interpretation: 'Between 10% and 30% of changes cause failures. A significant portion of changes need fixes.',
      recommendation: 'Add pre-merge checks, increase test coverage, and strengthen code review practices.',
    },
    low: {
      interpretation: 'More than 30% of changes cause failures. Many changes lead to incidents or hotfixes.',
      recommendation: 'Prioritize adding pre-merge checks, automated tests, and mandatory code review before merging.',
    },
  },
  mttr: {
    elite: {
      interpretation: 'Recovery in less than one hour. The team can detect and fix issues very quickly.',
      recommendation: 'Document recovery procedures and ensure the whole team can perform them.',
    },
    high: {
      interpretation: 'Recovery in less than one day. Issues are resolved within the same workday.',
      recommendation: 'Set up better alerting to detect issues faster and reduce initial response time.',
    },
    medium: {
      interpretation: 'Recovery takes between one day and one week. Resolution depends on availability and complexity.',
      recommendation: 'Implement monitoring, alerting, and have rollback strategies ready for quick recovery.',
    },
    low: {
      interpretation: 'Recovery takes more than one week. Slow response to incidents impacts reliability.',
      recommendation: 'Implement monitoring and alerting, define incident response procedures, and practice rollback strategies.',
    },
  },
};
