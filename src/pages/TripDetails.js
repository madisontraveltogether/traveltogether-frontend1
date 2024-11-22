// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import "../css/TripDashboard.css";
// import TopBar from "../components/TopBar";
// import BottomNav from "../components/BottomNav";

// const TripDetails = ({ currentUser }) => {
//   const { tripId } = useParams();
//   const navigate = useNavigate();

//   const [trip, setTrip] = useState({
//     pendingInvites: [],
//     attendees: [],
//     notifications: [],
//     announcements: [],
//   });
//   const [inviteLink, setInviteLink] = useState("");
//   const [tripCode, setTripCode] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [error, setError] = useState("");
//   const [newAnnouncement, setNewAnnouncement] = useState("");
//   const [announcementComments, setAnnouncementComments] = useState({});
//   const isOrganizer = currentUser?.id === trip?.organizer?.id;

//   // Fetch Trip Details
//   const fetchTripDetails = async () => {
//     try {
//       const response = await api.get(`/api/trips/${tripId}`);
//       setTrip(response.data);
//       setEditForm(response.data);
//     } catch (err) {
//       setError("Failed to load trip details.");
//     }
//   };

//   // Fetch Invite Link
//   const fetchInviteLink = async () => {
//     try {
//       const response = await api.get(`/api/trips/${tripId}/invite-link`);
//       setInviteLink(response.data.inviteLink);
//     } catch (err) {
//       setError("Failed to load invite link.");
//     }
//   };

//   // Fetch Trip Code
//   const fetchTripCode = async () => {
//     try {
//       const response = await api.get(`/api/trips/${tripId}/code`);
//       setTripCode(response.data.tripCode);
//     } catch (err) {
//       setError("Failed to load trip code.");
//     }
//   };

//   // Generate New Trip Code
//   const generateTripCode = async () => {
//     try {
//       const response = await api.post(`/api/trips/${tripId}/generate-code`);
//       setTripCode(response.data.tripCode);
//     } catch (err) {
//       setError("Failed to generate trip code.");
//     }
//   };

//   // Save Edited Trip Details
//   const handleSaveChanges = async () => {
//     try {
//       const response = await api.patch(`/api/trips/${tripId}`, editForm);
//       setTrip(response.data);
//       setIsEditing(false);
//     } catch (err) {
//       setError("Failed to save changes.");
//     }
//   };

//   // Handle Edit Form Change
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Upload Cover Photo
//   const handleCoverPhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append("coverPhoto", file);
//       try {
//         const response = await api.post(`/api/trips/${tripId}/cover`, formData);
//         setTrip((prev) => ({ ...prev, coverImage: response.data.coverImage }));
//       } catch (err) {
//         setError("Failed to upload cover photo.");
//       }
//     }
//   };

//   // Add New Announcement
//   const handleAddAnnouncement = async () => {
//     try {
//       const response = await api.post(`/api/trips/${tripId}/announcements`, {
//         message: newAnnouncement,
//       });
//       setTrip((prev) => ({
//         ...prev,
//         announcements: [response.data, ...prev.announcements],
//       }));
//       setNewAnnouncement("");
//     } catch (err) {
//       setError("Failed to add announcement.");
//     }
//   };

//   // Pin Announcement
//   const handlePinAnnouncement = async (announcementId) => {
//     try {
//       await api.post(`/api/trips/${tripId}/announcements/${announcementId}/pin`);
//       setTrip((prev) => ({
//         ...prev,
//         announcements: prev.announcements.map((a) =>
//           a._id === announcementId ? { ...a, isPinned: true } : { ...a, isPinned: false }
//         ),
//       }));
//     } catch (err) {
//       setError("Failed to pin announcement.");
//     }
//   };

//   // Add Comment to Announcement
//   const handleAddComment = async (announcementId, comment) => {
//     try {
//       const response = await api.post(
//         `/api/trips/${tripId}/announcements/${announcementId}/comments`,
//         { comment }
//       );
//       setAnnouncementComments((prev) => ({
//         ...prev,
//         [announcementId]: [...(prev[announcementId] || []), response.data],
//       }));
//     } catch (err) {
//       setError("Failed to add comment.");
//     }
//   };

//   // Notify All Attendees
//   const handleNotifyAll = async () => {
//     try {
//       await api.post(`/api/trips/${tripId}/notify`);
//       alert("Notifications sent to all attendees!");
//     } catch (err) {
//       setError("Failed to send notifications.");
//     }
//   };

//   useEffect(() => {
//     fetchTripDetails();
//     fetchInviteLink();
//     fetchTripCode();
//   }, [tripId]);

//   if (!trip) return <p>Loading...</p>;

//   return (
//     <div className="trip-details-page">
//       <TopBar title="Trip Details" />
//       {error && <p className="error-message">{error}</p>}

//       {/* Cover Photo */}
//       <div className="cover-photo">
//         <img src={trip.coverImage || "/assets/default-trip-image.jpg"} alt="Trip Cover" />
//         {isOrganizer && (
//           <div className="cover-photo-upload">
//             <input
//               type="file"
//               id="cover-photo"
//               accept="image/*"
//               onChange={handleCoverPhotoUpload}
//             />
//             <label htmlFor="cover-photo">Upload Cover Photo</label>
//           </div>
//         )}
//       </div>

//       {/* Invite Link */}
//       {isOrganizer && (
//         <div className="invite-link-section">
//           <h3>Invite Link</h3>
//           <input
//             type="text"
//             value={inviteLink}
//             readOnly
//             onClick={(e) => e.target.select()}
//           />
//           <button
//             onClick={() =>
//               navigator.clipboard.writeText(inviteLink).then(() => alert("Link copied!"))
//             }
//           >
//             Copy Link
//           </button>
//         </div>
//       )}

//       {/* Trip Code */}
//       {isOrganizer && (
//         <div className="trip-code-section">
//           <h3>Trip Code</h3>
//           {tripCode ? (
//             <p>{tripCode}</p>
//           ) : (
//             <button onClick={generateTripCode}>Generate Code</button>
//           )}
//         </div>
//       )}

//       {/* Announcements */}
//       <div className="announcements-section">
//         <h3>Announcements</h3>
//         {isOrganizer && (
//           <div className="new-announcement">
//             <textarea
//               value={newAnnouncement}
//               onChange={(e) => setNewAnnouncement(e.target.value)}
//               placeholder="Add a new announcement..."
//             />
//             <button onClick={handleAddAnnouncement}>Post</button>
//           </div>
//         )}
//         {trip.announcements.map((announcement) => (
//           <div key={announcement._id} className="announcement">
//             <p>{announcement.content}</p>
//             {isOrganizer && (
//               <button onClick={() => handlePinAnnouncement(announcement._id)}>
//                 Pin
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default TripDetails;


<div style={{width: '100%', height: '100%', position: 'relative', background: 'white'}}>
    <div style={{width: 428, height: 1283, left: 0, top: 66, position: 'absolute'}}>
        <img style={{width: 428, height: 200, left: 0, top: 0, position: 'absolute', background: 'linear-gradient(0deg, #D9D9D9 0%, #D9D9D9 100%)'}} src="https://via.placeholder.com/428x200" />
        <div style={{left: 15, top: 220, position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, display: 'inline-flex'}}>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, display: 'flex'}}>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'flex'}}>
                    <div style={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: 208, display: 'inline-flex'}}>
                        <div style={{width: 171, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 6, display: 'flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 71, display: 'flex'}}>
                                <div style={{width: 171, height: 24, position: 'relative'}}>
                                    <div style={{width: 171, height: 24, left: 0, top: 0, position: 'absolute', background: '#FFEEDD', borderRadius: 50}} />
                                    <div style={{left: 13, top: 4, position: 'absolute', color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '590', wordWrap: 'break-word'}}>April 7th - 10th, 2023</div>
                                </div>
                            </div>
                        </div>
                        <div style={{width: 26, height: 26, position: 'relative'}}>
                            <div style={{width: 26, height: 26, left: 0, top: 0, position: 'absolute', background: '#FFEEDD', borderRadius: 9999}} />
                            <div style={{width: 13.41, height: 13.39, left: 6.40, top: 6.21, position: 'absolute', background: '#EA8C1A'}}></div>
                        </div>
                    </div>
                    <div style={{color: '#443C3C', fontSize: 28, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Jacqueline’s Bachelorette!</div>
                    <div style={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex'}}>
                        <div style={{justifyContent: 'center', alignItems: 'center', gap: 49, display: 'flex'}}>
                            <div style={{width: 145, height: 17, justifyContent: 'center', alignItems: 'flex-start', gap: 5, display: 'flex'}}>
                                <div style={{width: 15, height: 15, position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
                                    <div style={{width: 10, height: 12.50, background: '#EA8C1A'}}></div>
                                </div>
                                <div style={{color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Las Vegas, Nevada</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: 399, height: 55, color: '#443C3C', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>We’re kicking off Jackie’s marriage the best way we know how: Vegas, baby! Let’s make her bachelorette party one she’ll definitely forget. 😉</div>
            </div>
            <div style={{width: 184, position: 'relative'}}>
                <div style={{width: 98, height: 17, paddingTop: 1, paddingBottom: 1, left: 86, top: 0, position: 'absolute', justifyContent: 'center', alignItems: 'flex-start', gap: 4, display: 'inline-flex'}}>
                    <img style={{width: 15, height: 15, borderRadius: 9999}} src="https://via.placeholder.com/15x15" />
                    <div style={{color: '#EA8C1A', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Mai Alexander</div>
                </div>
                <div style={{left: 0, top: 2, position: 'absolute', color: '#1E1E1E', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Organized by</div>
            </div>
        </div>
        <div style={{width: 397, height: 148, left: 16, top: 456, position: 'absolute'}}>
            <div style={{width: 397, height: 148, left: 0, top: 0, position: 'absolute', background: 'white', boxShadow: '1px 4px 12px 2px rgba(180.47, 108.81, 20.49, 0.10)', borderRadius: 50}} />
            <div style={{left: 154, top: 16, position: 'absolute', color: '#443C3C', fontSize: 18, fontFamily: 'SF Pro', fontWeight: '510', wordWrap: 'break-word'}}>Attendees</div>
            <div style={{width: 72, height: 74, left: 52, top: 49, position: 'absolute'}}>
                <div style={{left: 16, top: 32, position: 'absolute', color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Going</div>
                <div style={{left: 28, top: 0, position: 'absolute', color: '#1E1E1E', fontSize: 26, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>5</div>
                <img style={{width: 20, height: 19, left: 52, top: 55, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/20x19" />
                <img style={{width: 19, height: 19, left: 39, top: 55, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
                <img style={{width: 19, height: 19, left: 26, top: 55, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
                <img style={{width: 19, height: 19, left: 13, top: 55, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
                <img style={{width: 19, height: 19, left: 0, top: 55, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
            </div>
            <div style={{width: 87, height: 75, left: 270, top: 48, position: 'absolute'}}>
                <div style={{left: 21, top: 33, position: 'absolute', color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Invited</div>
                <div style={{left: 27, top: 0, position: 'absolute', color: '#1E1E1E', fontSize: 26, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>10</div>
                <div style={{width: 87, height: 19, left: 0, top: 56, position: 'absolute'}}>
                    <div style={{width: 20, height: 19, left: 67, top: 0, position: 'absolute', background: '#FFF9F3', borderRadius: 9999, border: '1px #A3A3A3 solid'}} />
                    <div style={{left: 73, top: 6, position: 'absolute', color: '#1E1E1E', fontSize: 7, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>+5</div>
                    <img style={{width: 20, height: 19, left: 52, top: 0, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/20x19" />
                    <img style={{width: 19, height: 19, left: 39, top: 0, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
                    <img style={{width: 19, height: 19, left: 26, top: 0, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
                    <img style={{width: 19, height: 19, left: 13, top: 0, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
                    <img style={{width: 19, height: 19, left: 0, top: 0, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
                </div>
            </div>
            <div style={{width: 44, height: 75, left: 176, top: 48, position: 'absolute'}}>
                <div style={{left: 0, top: 33, position: 'absolute', color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Maybe</div>
                <div style={{left: 14, top: 0, position: 'absolute', color: '#1E1E1E', fontSize: 26, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>2</div>
                <img style={{width: 19, height: 19, left: 17, top: 56, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
                <img style={{width: 19, height: 19, left: 4, top: 56, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/19x19" />
            </div>
        </div>
        <div style={{left: 15, top: 638, position: 'absolute'}}>
            <div style={{left: 0, top: 0, position: 'absolute', color: '#1E1E1E', fontSize: 26, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Announcements</div>
            <div style={{width: 26, height: 26, left: 372, top: 5, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                <div style={{width: 26, height: 26, background: '#FFEEDD', borderRadius: 9999}} />
                <div style={{width: 24, height: 24, position: 'relative'}}>
                    <div style={{width: 14, height: 14, left: 5, top: 5, position: 'absolute', background: '#EA8C1A'}}></div>
                </div>
            </div>
        </div>
        <div style={{width: 428, height: 514, left: 0, top: 682, position: 'absolute', background: 'white', borderRadius: 20}} />
        <div style={{paddingLeft: 17, paddingRight: 17, paddingTop: 14, paddingBottom: 14, left: 15, top: 689, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
            <div style={{justifyContent: 'flex-end', alignItems: 'flex-start', gap: 11, display: 'inline-flex'}}>
                <div style={{justifyContent: 'center', alignItems: 'flex-start', gap: 82, display: 'flex'}}>
                    <div style={{position: 'relative'}}>
                        <img style={{width: 31, height: 31, left: 0, top: 0, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/31x31" />
                        <div style={{left: 38, top: 7, position: 'absolute', color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Michel Robbins</div>
                    </div>
                    <div style={{color: '#A3A3A3', fontSize: 10, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>  Mar 1st, 2023 @ 3:29pm</div>
                </div>
                <div style={{width: 12, height: 16, position: 'relative'}}>
                    <div style={{width: 1.50, left: 7.25, top: 1.75, position: 'absolute'}}>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 0, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 5.50, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 11, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                    </div>
                </div>
            </div>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 9, display: 'flex'}}>
                <div style={{width: 366, height: 53}}><span style="color: '#443C3C', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'">I got our rooms at the Bellagio! </span><span style="color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'">@Mai Alexander</span><span style="color: '#1E1E1E', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'"> Let me know if you need any help decorating since I’ll be there a few days early and can grab supplies.</span><span style="color: '#443C3C', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'">        <br/><br/></span></div>
                <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                    <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 229, display: 'flex'}}>
                        <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'flex'}}>
                            <div style={{color: '#EA8C1A', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>2 Replies</div>
                            <div style={{width: 12, height: 11, position: 'relative'}}>
                                <div style={{width: 10, height: 8.25, left: 1, top: 1.38, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                            </div>
                        </div>
                        <div style={{width: 68, height: 20, position: 'relative'}}>
                            <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute'}}>
                                <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 16, height: 16, left: 5, top: 2, position: 'absolute'}}>
                                    <div style={{width: 14, height: 14, left: 1, top: 1, position: 'absolute', background: '#A3A3A3'}}></div>
                                </div>
                            </div>
                            <div style={{width: 26, height: 20, left: 39, top: 0, position: 'absolute'}}>
                                <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 16, height: 16, left: 5, top: 2, position: 'absolute'}}>
                                    <div style={{width: 14, height: 14, left: 1, top: 1, position: 'absolute', background: '#A3A3A3'}}></div>
                                </div>
                            </div>
                            <div style={{width: 39, height: 20, left: 29, top: 0, position: 'absolute'}}>
                                <div style={{width: 39, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 14, height: 14, left: 6, top: 3, position: 'absolute', color: 'white', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>🙏🏻</div>
                                <div style={{width: 9, height: 14, left: 23, top: 2, position: 'absolute', color: '#1E1E1E', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>2</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style={{width: 400, paddingLeft: 17, paddingRight: 17, paddingTop: 14, paddingBottom: 14, left: 19, top: 849, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
            <div style={{justifyContent: 'flex-end', alignItems: 'flex-start', gap: 11, display: 'inline-flex'}}>
                <div style={{justifyContent: 'center', alignItems: 'flex-start', gap: 68, display: 'flex'}}>
                    <div style={{position: 'relative'}}>
                        <img style={{width: 31, height: 31, left: 0, top: 0, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/31x31" />
                        <div style={{left: 38, top: 7, position: 'absolute', color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Mai Alexander</div>
                    </div>
                    <div style={{color: '#A3A3A3', fontSize: 10, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>January 16th, 2023 @ 2:49pm</div>
                </div>
                <div style={{width: 12, height: 16, position: 'relative'}}>
                    <div style={{width: 1.50, left: 7.25, top: 1.75, position: 'absolute'}}>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 0, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 5.50, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 11, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                    </div>
                </div>
            </div>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 9, display: 'flex'}}>
                <div style={{width: 366, height: 53, color: '#443C3C', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Here is the information about the lorem ipsum dolor sit amet constructeur<br/><br/></div>
                <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                    <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 229, display: 'flex'}}>
                        <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'flex'}}>
                            <div style={{color: '#EA8C1A', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>2 Replies</div>
                            <div style={{width: 12, height: 11, position: 'relative'}}>
                                <div style={{width: 10, height: 8.25, left: 1, top: 1.38, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                            </div>
                        </div>
                        <div style={{width: 68, height: 20, position: 'relative'}}>
                            <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute'}}>
                                <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 16, height: 16, left: 5, top: 2, position: 'absolute'}}>
                                    <div style={{width: 14, height: 14, left: 1, top: 1, position: 'absolute', background: '#A3A3A3'}}></div>
                                </div>
                            </div>
                            <div style={{width: 26, height: 20, left: 39, top: 0, position: 'absolute'}}>
                                <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 16, height: 16, left: 5, top: 2, position: 'absolute'}}>
                                    <div style={{width: 14, height: 14, left: 1, top: 1, position: 'absolute', background: '#A3A3A3'}}></div>
                                </div>
                            </div>
                            <div style={{width: 39, height: 20, left: 29, top: 0, position: 'absolute'}}>
                                <div style={{width: 39, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 14, height: 14, left: 6, top: 3, position: 'absolute', color: 'white', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>😂</div>
                                <div style={{width: 9, height: 14, left: 23, top: 2, position: 'absolute', color: '#1E1E1E', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>5</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style={{width: 400, paddingLeft: 17, paddingRight: 17, paddingTop: 14, paddingBottom: 14, left: 19, top: 1007, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
            <div style={{justifyContent: 'flex-end', alignItems: 'flex-start', gap: 11, display: 'inline-flex'}}>
                <div style={{justifyContent: 'center', alignItems: 'flex-start', gap: 69, display: 'flex'}}>
                    <div style={{position: 'relative'}}>
                        <img style={{width: 31, height: 31, left: 0, top: 0, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/31x31" />
                        <div style={{left: 38, top: 7, position: 'absolute', color: '#EA8C1A', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Natasha Lim</div>
                    </div>
                    <div style={{color: '#A3A3A3', fontSize: 10, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>December 15th, 2023 @ 5:32pm</div>
                </div>
                <div style={{width: 12, height: 16, position: 'relative'}}>
                    <div style={{width: 1.50, left: 7.25, top: 1.75, position: 'absolute'}}>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 0, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 5.50, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                        <div style={{width: 1.50, height: 1.50, left: 0, top: 11, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                    </div>
                </div>
            </div>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 9, display: 'flex'}}>
                <div style={{width: 366, height: 53, color: '#443C3C', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>Aw shoot! This actually falls on the same date as my sister’s wedding. I would’ve loved to come though. Have fun girls!</div>
                <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                    <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 229, display: 'flex'}}>
                        <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'flex'}}>
                            <div style={{color: '#EA8C1A', fontSize: 12, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>2 Replies</div>
                            <div style={{width: 12, height: 11, position: 'relative'}}>
                                <div style={{width: 10, height: 8.25, left: 1, top: 1.38, position: 'absolute', border: '1.50px #A3A3A3 solid'}}></div>
                            </div>
                        </div>
                        <div style={{width: 68, height: 20, position: 'relative'}}>
                            <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute'}}>
                                <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 16, height: 16, left: 5, top: 2, position: 'absolute'}}>
                                    <div style={{width: 14, height: 14, left: 1, top: 1, position: 'absolute', background: '#A3A3A3'}}></div>
                                </div>
                            </div>
                            <div style={{width: 26, height: 20, left: 39, top: 0, position: 'absolute'}}>
                                <div style={{width: 26, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 16, height: 16, left: 5, top: 2, position: 'absolute'}}>
                                    <div style={{width: 14, height: 14, left: 1, top: 1, position: 'absolute', background: '#A3A3A3'}}></div>
                                </div>
                            </div>
                            <div style={{width: 39, height: 20, left: 29, top: 0, position: 'absolute'}}>
                                <div style={{width: 39, height: 20, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 5, border: '1px #EAEAEA solid'}} />
                                <div style={{width: 14, height: 14, left: 6, top: 3, position: 'absolute', color: 'white', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>🥲 </div>
                                <div style={{width: 9, height: 14, left: 23, top: 2, position: 'absolute', color: '#1E1E1E', fontSize: 14, fontFamily: 'SF Pro', fontWeight: '400', wordWrap: 'break-word'}}>2</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style={{width: 11, height: 12, left: 184, top: 886, position: 'absolute', transform: 'rotate(180deg)', transformOrigin: '0 0', background: '#EA8C1A'}}></div>
    </div>
    <div style={{width: 428, height: 114, left: -1, top: 815, position: 'absolute'}}>
        <div style={{width: 426, height: 106, left: 2, top: 0, position: 'absolute', background: '#FFF9F3'}} />
        <div style={{width: 397, height: 91, left: 17, top: 7, position: 'absolute'}}>
            <div style={{width: 397, height: 91, left: 0, top: 0, position: 'absolute', background: '#FFFAF5', boxShadow: '0px 4px 20px 5px rgba(192.15, 183.34, 183.34, 0.51)', borderRadius: 40}} />
            <div style={{width: 322, height: 44, left: 38, top: 24, position: 'absolute'}}>
                <div style={{width: 59, height: 44, left: 0, top: 0, position: 'absolute'}}>
                    <div style={{width: 28, height: 28, left: 15, top: 0, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                        <div style={{width: 18.67, height: 20.42, background: '#EA8C1A'}}></div>
                    </div>
                    <div style={{left: 0, top: 30, position: 'absolute', color: '#EA8C1A', fontSize: 12, fontFamily: 'SF Pro Text', fontWeight: '400', wordWrap: 'break-word'}}>Trip Home</div>
                </div>
                <div style={{width: 31, height: 44, left: 99, top: 0, position: 'absolute'}}>
                    <div style={{width: 28, height: 28, left: 1, top: 0, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                        <div style={{width: 21, height: 21, background: '#9C9C9C'}}></div>
                    </div>
                    <div style={{left: 0, top: 30, position: 'absolute', color: '#9C9C9C', fontSize: 12, fontFamily: 'SF Pro Text', fontWeight: '400', wordWrap: 'break-word'}}>Plans</div>
                </div>
                <div style={{width: 55, height: 44, left: 170, top: 0, position: 'absolute'}}>
                    <div style={{width: 28, height: 28, left: 14, top: 0, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                        <div style={{width: 26, height: 16, background: '#9C9C9C'}}></div>
                        <div style={{width: 6, height: 9, background: '#9C9C9C'}}></div>
                    </div>
                    <div style={{left: 0, top: 30, position: 'absolute', color: '#9C9C9C', fontSize: 12, fontFamily: 'SF Pro Text', fontWeight: '400', wordWrap: 'break-word'}}>Expenses</div>
                </div>
                <div style={{width: 57, height: 44, left: 265, top: 0, position: 'absolute'}}>
                    <div style={{width: 28, height: 28, left: 15, top: 0, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                        <div style={{width: 23, height: 21, background: '#9C9C9C'}}></div>
                    </div>
                    <div style={{left: 0, top: 30, position: 'absolute', color: '#9C9C9C', fontSize: 12, fontFamily: 'SF Pro Text', fontWeight: '400', wordWrap: 'break-word'}}>Messages</div>
                </div>
            </div>
        </div>
    </div>
    <div style={{width: 428, height: 66, left: 0, top: 0, position: 'absolute', background: '#FFFAF5'}} />
    <img style={{width: 33, height: 33, left: 37, top: 17, position: 'absolute', borderRadius: 9999, border: '1px #EA8C1A solid'}} src="https://via.placeholder.com/33x33" />
    <div style={{width: 34, height: 30, left: 364, top: 17, position: 'absolute'}}>
        <div style={{width: 27, height: 27, left: 0, top: 3, position: 'absolute'}}>
            <div style={{width: 22.35, height: 21.88, left: 2.29, top: 1.33, position: 'absolute', background: '#EA8C1A'}}></div>
            <div style={{width: 3.94, height: 1.72, left: 11.49, top: 24, position: 'absolute', background: '#EA8C1A'}}></div>
            <div style={{width: 27, height: 27, left: 0, top: 0, position: 'absolute'}}></div>
        </div>
        <div style={{width: 17, height: 17, left: 17, top: 0, position: 'absolute', background: '#FF5C38', borderRadius: 9999, border: '2px #FFFAF5 solid'}} />
    </div>
</div>