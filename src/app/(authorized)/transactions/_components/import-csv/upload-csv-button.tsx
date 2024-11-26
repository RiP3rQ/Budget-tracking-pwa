import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Props = {
  onUpload: (results: any) => void;
};

export const UploadCSVButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  // TODO: add a paywall

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button size={"sm"} className={"w-full lg:w-auto"} {...getRootProps()}>
          <Upload className={"size-4 mr-2"} />
          Importuj
        </Button>
      )}
    </CSVReader>
  );
};
