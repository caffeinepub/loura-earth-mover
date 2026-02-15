import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Empty state for storage blob component
  let storageState = {};

  // User profiles
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Service Types (Only exteriorWashing supported right now)
  public type ServiceType = {
    #exteriorWashing;
  };

  // Inquiry Status (Admin-only field)
  public type InquiryStatus = {
    #pending;
    #inProgress;
    #completed;
    #archived;
  };

  // Inquiry data
  public type Inquiry = {
    id : Int;
    name : Text;
    email : Text;
    phone : ?Text;
    service : ServiceType;
    location : ?Text;
    message : Text;
    timestamp : Int;
    status : InquiryStatus;
  };

  module Inquiry {
    public func compareByTimestamp(a : Inquiry, b : Inquiry) : Order.Order {
      if (a.timestamp < b.timestamp) {
        #less;
      } else if (a.timestamp > b.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };

    public func withStatus(inquiry : Inquiry, status : InquiryStatus) : Inquiry {
      {
        id = inquiry.id;
        name = inquiry.name;
        email = inquiry.email;
        phone = inquiry.phone;
        service = inquiry.service;
        location = inquiry.location;
        message = inquiry.message;
        timestamp = inquiry.timestamp;
        status;
      };
    };
  };

  var nextInquiryId = 0;
  let inquiries = Map.empty<Int, Inquiry>();

  // Inquiry creation (public - anyone can submit a contact form)
  public shared ({ caller }) func createInquiry(
    name : Text,
    email : Text,
    phone : ?Text,
    service : ServiceType,
    location : ?Text,
    message : Text,
  ) : async Int {
    let id = nextInquiryId;
    nextInquiryId += 1;
    let inquiry : Inquiry = {
      id;
      name;
      email;
      phone;
      service;
      location;
      message;
      timestamp = (id.toFloat() + 1e9 * 1.0).toInt();
      status = #pending;
    };
    inquiries.add(id, inquiry);
    id;
  };

  // List all inquiries sorted by timestamp (admin-only)
  public query ({ caller }) func listInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list inquiries");
    };
    inquiries.values().toArray().sort(Inquiry.compareByTimestamp);
  };

  // Get a specific inquiry by ID (admin-only)
  public query ({ caller }) func getInquiry(inquiryId : Int) : async Inquiry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    switch (inquiries.get(inquiryId)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) { inquiry };
    };
  };

  // Gallery Image Types and Storage
  public type GalleryImage = {
    id : Text;
    filename : Text;
    alt : ?Text;
    blob : Storage.ExternalBlob;
  };

  public type GalleryImageMetadata = {
    id : Text;
    filename : Text;
    alt : ?Text;
    blob : Storage.ExternalBlob;
  };

  let galleryImages = Map.empty<Text, GalleryImage>();

  // Upload gallery image (admin-only)
  public shared ({ caller }) func uploadGalleryImage(
    id : Text,
    filename : Text,
    blob : Storage.ExternalBlob,
    alt : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload gallery images");
    };

    let galleryImage : GalleryImage = {
      id;
      filename;
      blob;
      alt;
    };
    galleryImages.add(id, galleryImage);
  };

  // Get gallery image metadata (all users)
  public query ({ caller }) func listGalleryImages() : async [GalleryImageMetadata] {
    galleryImages.values().toArray().map(
      func(image) {
        {
          id = image.id;
          filename = image.filename;
          blob = image.blob;
          alt = image.alt;
        };
      }
    );
  };

  // Get gallery image by id (all users)
  public query ({ caller }) func getGalleryImage(id : Text) : async ?GalleryImage {
    galleryImages.get(id);
  };

  // Delete gallery image (admin-only)
  public shared ({ caller }) func deleteGalleryImage(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery images");
    };
    galleryImages.remove(id);
  };
};
