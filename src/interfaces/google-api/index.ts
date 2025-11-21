export interface IGooglePeople {
  resourceName: string;
  etag: string;
  names?: Name[];
  photos?: Photo[];
  genders?: Gender[];
  birthdays?: Birthday[];
  emailAddresses?: EmailAddress[];
}

export interface Photo {
  metadata: {
    primary?: boolean;
    source: {
      type: string;
      id: string;
    };
  };
  url: string;
}

export interface Name {
  metadata: {
    primary?: boolean;
    source: {
      type: string;
      id: string;
    };
    sourcePrimary?: boolean;
  };
  displayName: string;
  familyName?: string;
  givenName?: string;
  displayNameLastFirst?: string;
  unstructuredName?: string;
}

export interface Gender {
  metadata: {
    primary?: boolean;
    source: {
      type: string;
      id: string;
    };
  };
  value: string;
  formattedValue?: string;
}

export interface Birthday {
  metadata: {
    primary?: boolean;
    source: {
      type: string;
      id: string;
    };
  };
  date: {
    year?: number;
    month?: number;
    day?: number;
  };
}

export interface EmailAddress {
  metadata: {
    primary?: boolean;
    verified?: boolean;
    source: {
      type: string;
      id: string;
    };
    sourcePrimary?: boolean;
  };
  value: string;
}
