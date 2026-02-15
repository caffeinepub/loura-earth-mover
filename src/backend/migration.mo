import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type OldActor = {
    nextInquiryId : Nat;
    userProfiles : Map.Map<Principal, { name : Text }>;
    inquiries : Map.Map<Int, {
      id : Int;
      name : Text;
      email : Text;
      phone : ?Text;
      service : {
        #exteriorWashing;
      };
      location : ?Text;
      message : Text;
      timestamp : Int;
      status : {
        #pending;
        #inProgress;
        #completed;
        #archived;
      };
    }>;
  };

  public type NewActor = {
    nextInquiryId : Nat;
    userProfiles : Map.Map<Principal, { name : Text }>;
    inquiries : Map.Map<Int, {
      id : Int;
      name : Text;
      email : Text;
      phone : ?Text;
      service : {
        #exteriorWashing;
      };
      location : ?Text;
      message : Text;
      timestamp : Int;
      status : {
        #pending;
        #inProgress;
        #completed;
        #archived;
      };
    }>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
