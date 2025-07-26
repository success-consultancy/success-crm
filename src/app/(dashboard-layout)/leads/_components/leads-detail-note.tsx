import SectionWrapper from "@/components/templates/section-wrapper";

type Props = {};

const LeadsDetailsNote = (props: Props) => {
  return (
    <SectionWrapper title="Note">
      <p className="text-sm text-neutral-darkGrey">
        Had a follow-up call with John regarding his study plans for the UK. He
        is interested in the January intake for a Master’s in Business
        Administration. Currently preparing for IELTS and plans to take the test
        next month. Needs guidance on university options and scholarship
        opportunities. Scheduled another call for next week to discuss
        shortlisted universities.{" "}
      </p>
    </SectionWrapper>
  );
};

export default LeadsDetailsNote;
