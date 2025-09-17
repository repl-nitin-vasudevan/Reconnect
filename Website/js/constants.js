export const DEFAULT_START_DATE = new Date("2025-08-31T00:00:00+05:30");
export const DEFAULT_AGENDA_DATA = {
    "1": [
        {
            "id": 1,
            "session": "Hotel Check-In & Deltek Registration",
            "category": "Registration",
            "speaker": "",
            "startTime": "10:00 AM",
            "endTime": "7:30 PM",
            "location": "Novotel Lobby & Raddison Blu Lobby",
            "description": "Welcome to Goa! Please check into your hotel and complete your event registration at the Deltek desk.",
            "objectives": ["Complete hotel check-in", "Receive event welcome kit", "Get your event badge"],
            "materials": ["Welcome Kit"],
            "tags": ["Registration", "Check-in", "Welcome"]
        },
        {
            "id": 2,
            "session": "Lunch",
            "category": "Lunch",
            "speaker": "",
            "startTime": "12:30 PM",
            "endTime": "4:00 PM",
            "location": "Seagull Restaurant (Novotel)",
            "description": "Enjoy a leisurely lunch upon your arrival and mingle with fellow attendees.",
            "objectives": ["Networking", "Relaxation"],
            "materials": [],
            "tags": ["Lunch", "Networking"]
        },
        {
            "id": 3,
            "session": "Networking / Leisure Time",
            "category": "Networking",
            "speaker": "",
            "startTime": "4:00 PM",
            "endTime": "7:30 PM",
            "location": "Resort Premises",
            "description": "Settle in, explore the beautiful resort grounds, or connect with colleagues at your leisure before the evening activities.",
            "objectives": ["Relax and recharge", "Informal networking", "Explore the venue"],
            "materials": [],
            "tags": ["Networking", "Leisure", "Free Time"]
        },
        {
            "id": 4,
            "session": "Dinner",
            "category": "Dinner",
            "speaker": "",
            "startTime": "7:30 PM",
            "endTime": "11:00 PM",
            "location": "Seagull Restaurant (Novotel)",
            "description": "Join us for the welcome dinner and kick off the event informally with delicious food and great company.",
            "objectives": ["Socializing", "Networking"],
            "materials": [],
            "tags": ["Dinner", "Networking", "Welcome"]
        }
    ],
    "2": [
        {
            "id": 5,
            "session": "Breakfast",
            "category": "Breakfast",
            "speaker": "",
            "startTime": "7:00 AM",
            "endTime": "9:00 AM",
            "location": "Novotel + Raddison + Holiday Inn Restaurant",
            "description": "Start the day with a delicious breakfast and networking.",
            "objectives": [
                "Networking",
                "Enjoy breakfast"
            ],
            "materials": [],
            "tags": [
                "Breakfast",
                "Networking"
            ]
        },
        {
            "id": 6,
            "session": "Welcome & Introduction",
            "category": "Opening",
            "speaker": "Ian Gallyot",
            "speakerTitle": "Director, L&D",
            "speakerImage": "https://media.licdn.com/dms/image/v2/C5603AQEwgaT6RSdgLA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1575205119009?e=1758758400&v=beta&t=FdKpOBadm-qo6wIfPdtLHf1buYcUEyJm7PxU-UcTO9s",
            "startTime": "9:00 AM",
            "endTime": "9:15 AM",
            "location": "Novotel Ballroom",
            "description": "Official start of the event with a welcome from Ian Gallyot, featuring an AI Co-Host.",
            "objectives": [
                "Event kickoff",
                "Set the tone"
            ],
            "materials": [
                "Agenda overview",
                "AI Co-Host"
            ],
            "tags": [
                "Keynote",
                "Welcome",
                "Opening",
                "AI"
            ]
        },
        {
            "id": 34,
            "session": "Bob's Welcome Note",
            "category": "Opening",
            "speaker": "Bob Hughes",
            "startTime": "9:15 AM",
            "endTime": "9:20 AM",
            "location": "Novotel Ballroom",
            "description": "A special welcome note via audio and video from Bob Hughes.",
            "objectives": ["Receive welcome message from leadership"],
            "materials": ["Video Presentation"],
            "tags": ["Welcome", "Keynote", "Leadership"]
        },
        {
            "session": "All Hands",
            "category": "Company Update",
            "speaker": "Dinakar Hituvalli",
            "speakerTitle": "SVP, Chief Technology Officer",
            "speakerImage": "https://mma.prnewswire.com/media/2055830/Deltek_Dinakar_Hituvalli.jpg",
            "startTime": "9:20 AM",
            "endTime": "10:45 AM",
            "location": "Novotel Ballroom",
            "description": "A comprehensive update on company strategy, performance, and vision.",
            "objectives": [
                "Share company vision",
                "Review performance",
                "Align team goals"
            ],
            "materials": [
                "Presentation slides"
            ],
            "tags": [
                "All-Hands",
                "Strategy",
                "Business Update"
            ],
            "id": 7
        },
        {
            "id": 8,
            "session": "Break",
            "category": "Break",
            "speaker": "",
            "startTime": "10:45 AM",
            "endTime": "11:00 AM",
            "location": "Novotel Ballroom",
            "description": "A short break for coffee and networking.",
            "objectives": [
                "Networking",
                "Refreshment"
            ],
            "materials": [],
            "tags": [
                "Networking",
                "Break"
            ]
        },
        {
            "session": "Product Overview Session",
            "category": "Product",
            "speaker": "Bret Tushaus",
            "speakerTitle": "VP, Product Management",
            "speakerImage": "https://www.deltek.com/-/media/deltekblogs/authors/author-bret-tushaus.ashx?h=170&w=170&la=en-GB&hash=DFD40D4C519446314B013366C81E6714",
            "startTime": "11:00 AM",
            "endTime": "12:30 PM",
            "location": "Novotel Ballroom",
            "description": "An overview of Deltek's product landscape and future roadmap.",
            "objectives": [
                "Understand product strategy",
                "Review product roadmap"
            ],
            "materials": [
                "Product demos",
                "Roadmap slides",
                "Mentimeter"
            ],
            "tags": [
                "Product",
                "Roadmap",
                "Strategy"
            ],
            "id": 9
        },
        {
            "id": 10,
            "session": "HR Session + Team Photograph",
            "category": "Company Update",
            "speaker": "HR Team",
            "startTime": "12:30 PM",
            "endTime": "1:30 PM",
            "location": "Novotel Ballroom",
            "description": "Important updates from the Human Resources team, followed by a team photograph.",
            "objectives": [
                "Understand HR policies",
                "Team engagement initiatives",
                "Capture a team photo"
            ],
            "materials": ["Presentation Slides"],
            "tags": [
                "HR",
                "Company Culture",
                "Team Photo"
            ]
        },
        {
            "id": 11,
            "session": "Lunch",
            "category": "Lunch",
            "speaker": "",
            "startTime": "1:30 PM",
            "endTime": "2:30 PM",
            "location": "Novotel Ballroom",
            "description": "Enjoy a catered lunch and connect with colleagues.",
            "objectives": [
                "Team bonding",
                "Networking"
            ],
            "materials": [],
            "tags": [
                "Lunch",
                "Networking"
            ]
        },
        {
            "id": 12,
            "session": "Team Building Event (Hawaiian Theme)",
            "category": "Entertainment",
            "speaker": "Ian Gallyot",
            "speakerTitle": "Director, L&D",
            "speakerImage": "https://media.licdn.com/dms/image/v2/C5603AQEwgaT6RSdgLA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1575205119009?e=1758758400&v=beta&t=FdKpOBadm-qo6wIfPdtLHf1buYcUEyJm7PxU-UcTO9s",
            "startTime": "3:00 PM",
            "endTime": "6:00 PM",
            "location": "Seaside Lawn Area",
            "description": "Engaging Hawaiian-themed activities designed to foster collaboration and team spirit.",
            "objectives": [
                "Improve team cohesion",
                "Promote collaboration",
                "Have fun"
            ],
            "materials": [
                "Activity gear"
            ],
            "tags": [
                "Team Building",
                "Activity",
                "Hawaiian Theme"
            ]
        },
        {
            "id": 13,
            "session": "Live Band + Dinner ( Indian Movie Theme)",
            "category": "Entertainment",
            "speaker": "Savaari",
            "speakerImage": "https://static.wixstatic.com/media/4743dd_ed4e0b776cdf4f09ae51939fa6bf616d~mv2.png/v1/fill/w_2100,h_1620,al_c,q_95,usm_0.66_1.00_0.01,enc_avif,quality_auto/4743dd_ed4e0b776cdf4f09ae51939fa6bf616d~mv2.png",
            "startTime": "7:30 PM",
            "endTime": "11:00 PM",
            "location": "Novotel Ballroom",
            "description": "An 'Indian Movie Theme' dinner to relax and socialize, featuring a captivating live performance by **Savaari**. Get ready for an evening of soulful melodies and energetic Bollywood hits that will make you want to dance the night away. Learn more about the band at [savaarimusic.com](https://www.savaarimusic.com/).",
            "objectives": [
                "Enjoy a live Bollywood music concert",
                "Experience the energy of Savaari",
                "Network in a festive atmosphere"
            ],
            "materials": [],
            "tags": [
                "Dinner",
                "Entertainment",
                "Music",
                "Live Band",
                "Savaari"
            ]
        }
    ],
    "3": [
        {
            "id": 14,
            "session": "Breakfast",
            "category": "Breakfast",
            "speaker": "",
            "startTime": "7:00 AM",
            "endTime": "9:00 AM",
            "location": "Novotel + Raddison + Holiday Inn Restaurant",
            "description": "Start Day 3 with a delicious breakfast and networking opportunities.",
            "objectives": ["Networking", "Enjoy breakfast"],
            "materials": [],
            "tags": ["Breakfast", "Networking"]
        },
        {
            "id": 15,
            "session": "Welcome and Introduction by VPs",
            "category": "Opening",
            "speaker": "Mike Scopa & Jamie Forgan",
            "speakers": [
                {
                    "name": "Mike Scopa",
                    "title": "SVP, Engineering",
                    "image": "https://media.licdn.com/dms/image/v2/D4E03AQE1UIsmTR6_cg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1677868592353?e=2147483647&v=beta&t=QbaSW2UiiB8jytTuzWil4IS8m5SIsrHjMiG8t6dEi38"
                },
                {
                    "name": "Jamie Forgan",
                    "title": "VP, Engineering",
                    "image": "https://www.deltek.com/-/media/deltek-global/images/experts/forgan-jamie.ashx"
                }
            ],
            "startTime": "9:00 AM",
            "endTime": "9:15 AM",
            "location": "Novotel Ballroom",
            "description": "Kick off the day with a warm welcome and introduction from the VPs.",
            "objectives": ["Set the agenda for the day", "Welcome attendees"],
            "materials": [],
            "tags": ["Welcome", "Opening", "VPs"]
        },
        {
            "id": 16,
            "session": "AWS AI Training Session",
            "category": "Training",
            "speaker": "Sachin Sai Marella",
            "speakerTitle": "Senior Solutions Architect, AWS",
            "speakerImage": "https://media.licdn.com/dms/image/D5603AQF0eR_6_i-T6g/profile-displayphoto-shrink_400_400/0/1715015024476?e=1726099200&v=beta&t=6u1Y1vM1R6X-P7_Z4r5X9y7zW8lQ4zV6y3N3Z_kC0bI",
            "startTime": "9:15 AM",
            "endTime": "10:30 AM",
            "location": "Novotel Ballroom",
            "description": "An in-depth training session on leveraging AWS for Artificial Intelligence and Machine Learning.",
            "objectives": ["Understand AWS AI/ML services", "Learn best practices for implementation", "Explore real-world use cases"],
            "materials": ["Live Demos", "Q&A Session"],
            "tags": ["AWS", "AI", "Machine Learning", "Training", "Workshop"]
        },
        {
            "id": 17,
            "session": "Break",
            "category": "Break",
            "speaker": "",
            "startTime": "10:30 AM",
            "endTime": "10:45 AM",
            "location": "Novotel Ballroom",
            "description": "A short break for refreshments and networking.",
            "objectives": ["Networking", "Refreshment"],
            "materials": [],
            "tags": ["Networking", "Break"]
        },
        {
            "id": 18,
            "session": "AI Hackathon",
            "category": "Hackathon",
            "speaker": "All Teams",
            "startTime": "10:45 AM",
            "endTime": "11:59 PM",
            "location": "Novotel Ballroom",
            "description": "**The AI Hackathon kicks off!** Teams will work throughout the day to develop innovative AI-powered solutions. The coding phase continues until midnight.",
            "objectives": ["Develop a functional AI prototype", "Collaborate effectively within your team", "Showcase innovative thinking"],
            "materials": ["Laptops", "Development Environments", "APIs"],
            "tags": ["Hackathon", "AI", "Innovation", "Competition", "Coding"],
            "preread": {
                "title": "Hackathon Pre-Read & Setup",
                "checklist": [
                    {
                        "title": "Team Formation",
                        "description": "Please ensure your team of 5 members is finalized before the event. If you need assistance, contact the organizers."
                    },
                    {
                        "title": "AWS Account & Credits",
                        "description": "Each team will be provided with a dedicated AWS account with pre-loaded credits. Account details will be shared on the day of the hackathon."
                    },
                    {
                        "title": "Development Environment",
                        "description": "Ensure your laptops have your preferred development environments, tools, and IDEs installed and ready to go."
                    },
                    {
                        "title": "Review AWS AI/ML Services",
                        "description": "It's highly recommended to familiarize yourself with key AWS services that will be beneficial for the hackathon. Pay special attention to the services that will be covered in the morning training session.",
                        "links": [
                            { "text": "Amazon SageMaker", "url": "https://aws.amazon.com/sagemaker/" },
                            { "text": "Amazon Bedrock", "url": "https://aws.amazon.com/bedrock/" },
                            { "text": "Amazon Rekognition", "url": "https://aws.amazon.com/rekognition/" }
                        ]
                    }
                ],
                "references": [
                    { "text": "Generative AI on AWS", "url": "https://aws.amazon.com/generative-ai/" },
                    { "text": "AWS Machine Learning Documentation", "url": "https://docs.aws.amazon.com/machine-learning/index.html" },
                    { "text": "Awesome Generative AI (GitHub Repo)", "url": "https://github.com/steven2358/awesome-generative-ai" }
                ]
            }
        },
        {
            "id": 19,
            "session": "Lunch",
            "category": "Lunch",
            "speaker": "",
            "startTime": "1:00 PM",
            "endTime": "2:00 PM",
            "location": "Novotel Ballroom",
            "description": "Lunch break for all hackathon participants.",
            "objectives": ["Recharge and refuel", "Discuss strategy with your team"],
            "materials": [],
            "tags": ["Lunch", "Networking", "Hackathon"]
        },
        {
            "id": 20,
            "session": "Dinner",
            "category": "Dinner",
            "speaker": "",
            "startTime": "8:00 PM",
            "endTime": "9:00 PM",
            "location": "Novotel Ballroom",
            "description": "Dinner for all hackathon participants. Keep the code flowing!",
            "objectives": ["Networking dinner"],
            "materials": [],
            "tags": ["Dinner", "Networking", "Hackathon"]
        }
    ],
    "4": [
        {
            "id": 21,
            "session": "Breakfast",
            "category": "Breakfast",
            "speaker": "",
            "startTime": "7:00 AM",
            "endTime": "9:00 AM",
            "location": "Novotel + Raddison + Holiday Inn Restaurant",
            "description": "Enjoy breakfast and prepare for the final day of sessions.",
            "objectives": ["Networking", "Enjoy breakfast"],
            "materials": [],
            "tags": ["Breakfast", "Networking"]
        },
        {
            "id": 22,
            "session": "Hackathon Demo - Judging",
            "category": "Hackathon",
            "speaker": "All Teams",
            "startTime": "9:00 AM",
            "endTime": "11:00 AM",
            "location": "Novotel Ballroom",
            "description": "**Time to shine!** Each team will present a 5-minute demo of their hackathon project to the judging panel. This is your chance to showcase your innovation and hard work.",
            "objectives": ["Present project demo", "Explain the technical solution", "Answer questions from judges"],
            "materials": ["Project Demos", "Presentation Slides"],
            "tags": ["Hackathon", "AI", "Innovation", "Judging", "Presentation"]
        },
        {
            "id": 23,
            "session": "Break",
            "category": "Break",
            "speaker": "",
            "startTime": "11:00 AM",
            "endTime": "11:15 AM",
            "location": "Novotel Ballroom",
            "description": "A short break for refreshments and networking.",
            "objectives": ["Networking", "Refreshment"],
            "materials": [],
            "tags": ["Networking", "Break"]
        },
        {
            "id": 24,
            "session": "Deltek Product Council (DPC) & Product Management",
            "category": "Product",
            "speaker": "An-Louise De Beer",
            "speakerTitle": "Senior Director, Product Management",
            "speakerImage": "https://media.licdn.com/dms/image/C4D03AQGs9bWjF4tY7A/profile-displayphoto-shrink_400_400/0/1516265773822?e=1726099200&v=beta&t=c5rK2W4B_z7_9_i-n3jA2Y2J2f8g8Z6J6J8x0X8n4y8",
            "startTime": "11:15 AM",
            "endTime": "12:00 PM",
            "location": "Novotel Ballroom",
            "description": "A session focused on the Deltek Product Council's role and the future direction of product management.",
            "objectives": ["Understand the DPC's mission", "Learn about upcoming product strategies", "Engage with product leadership"],
            "materials": ["Presentation Slides"],
            "tags": ["DPC", "Product Management", "Strategy"]
        },
        {
            "id": 25,
            "session": "Q&A with E&T Leadership",
            "category": "Company Update",
            "speaker": "E&T VPs",
            "startTime": "12:00 PM",
            "endTime": "1:00 PM",
            "location": "Novotel Ballroom",
            "description": "An open forum for Q&A with the Engineering and Technology leadership team.",
            "objectives": ["Ask questions to leadership", "Gain clarity on company direction", "Open communication"],
            "materials": ["Mentimeter"],
            "tags": ["Q&A", "Leadership", "Townhall"]
        },
        {
            "id": 26,
            "session": "Lunch",
            "category": "Lunch",
            "speaker": "",
            "startTime": "1:00 PM",
            "endTime": "2:00 PM",
            "location": "Novotel Ballroom",
            "description": "Enjoy lunch and network with colleagues.",
            "objectives": ["Networking", "Lunch"],
            "materials": [],
            "tags": ["Lunch", "Networking"]
        },
        {
            "id": 27,
            "session": "Hackathon Award Ceremony",
            "category": "Hackathon",
            "speaker": "Judges",
            "startTime": "2:00 PM",
            "endTime": "3:00 PM",
            "location": "Novotel Ballroom",
            "description": "The moment of truth! Announcement of the AI Hackathon winners and prize distribution.",
            "objectives": ["Celebrate innovation", "Announce winners", "Distribute prizes"],
            "materials": ["Awards"],
            "tags": ["Hackathon", "Awards", "Closing", "Ceremony"]
        },
        {
            "id": 30,
            "session": "VP Driven Breakout Meetings",
            "category": "Planning",
            "speaker": "All VPs",
            "startTime": "3:00 PM",
            "endTime": "7:30 PM",
            "location": "Multiple Venues",
            "description": "Focused breakout meetings are happening in parallel, led by each VP for their respective teams. These sessions are designed for strategic planning, team-specific discussions, and roadmap alignment. Please find your team's track below to see the detailed schedule and venue information.",
            "objectives": [
                "Conduct team-specific strategic planning",
                "Align on future goals and roadmaps",
                "Facilitate focused departmental discussions"
            ],
            "materials": [
                "Whiteboards",
                "Presentation Decks"
            ],
            "tags": [
                "Breakout",
                "Strategy",
                "Planning",
                "Workshops"
            ],
            "breakoutTracks": [
                {
                    "leader": "Dinakar",
                    "location": "Radisson - Lisboa 1",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "1-1 Kanishka (25 Mins)\nHR Meeting (25 Mins)", "participants": "Kanishka, Anirudhan, Susmita", "location": "Radisson Blu - Sintra" },
                        { "time": "4:00 - 4:50 PM", "title": "Cost Point QA Updates", "participants": "Bindu + Shreyans + Nelson + Nitin + Vijay + Mike + Dinakar + Hardik + Online Matt, Leo, Janet, JV, JP, Joms, CP QE Mgr + Jeevan", "location": "Radisson Blu - Sintra" },
                        { "time": "5:00 - 5:50 PM", "title": "Replicon Product Meetings", "participants": "Enrique's Team + Vijay + Dinakar" },
                        { "time": "6:00 - 6:25 PM", "title": "Shared Services Team Meeting", "participants": "Kavya's Team, Badri's Team, Nitin S, Vijay, Dinakar, Jogesh, Swapnil, Abdul" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                },
                {
                    "leader": "Gaurav & Shane",
                    "location": "Novotel - Grand BallRoom",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "Cloud All Hands", "participants": "Gaurav's Org" },
                        { "time": "4:00 - 4:50 PM", "title": "Cloud Platform Meeting", "participants": "Cloud Platform Team" },
                        { "time": "5:00 - 5:50 PM", "title": "Cloud Replicon Meeting", "participants": "Cloud Replicon Team" },
                        { "time": "6:00 - 6:25 PM", "title": "Gaurav's Additional Meetings", "participants": "TBD" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's", "location": "Radisson - Lisboa 1" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                },
                {
                    "leader": "Vijay",
                    "location": "Radisson - Lisboa 1",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "Vijay's All Hands", "participants": "Vijay's Org" },
                        { "time": "4:00 - 4:50 PM", "title": "Cost Point QA Updates", "participants": "Bindu + Shreyans + Nelson + Nitin + Vijay + Mike + Dinakar + Hardik + Online Matt, Leo, Janet, JV, JP, Joms, CP QE Mgr + Jeevan", "location": "Radisson Blu - Sintra" },
                        { "time": "5:00 - 5:50 PM", "title": "Replicon Product Meetings", "participants": "Enrique's Team + Vijay + Dinakar" },
                        { "time": "6:00 - 6:25 PM", "title": "Shared Services Team Meeting", "participants": "Kavya's Team, Badri's Team, Nitin S, Vijay, Dinakar, Jogesh, Swapnil, Abdul" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                },
                {
                    "leader": "Jamie",
                    "location": "Radisson - Braga",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "PPM All Hands", "participants": "PPM Eng + PDM (Rob)" },
                        { "time": "4:00 - 4:50 PM", "title": "PPM NextGen Acceleration", "participants": "PPM Eng + PDM (Rob) + QA (PPM) + Kavya +DevOps" },
                        { "time": "5:00 - 5:50 PM", "title": "Meeting with Nitin & Lavanya (25 Mins)\n1-1 Kavya (25 Mins)", "participants": "Jamie, Lavanya, Kavya, Nidheesh", "location": "Radisson Blu - Sintra" },
                        { "time": "6:00 - 6:25 PM", "title": "AI Transformation - SDLC & Product", "participants": "PPM Eng + PDM (Rob) + QA (PPM) +DevOps (Basu Chadda, Suresh, Chaitanya, Bhanu Ranjan)" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's", "location": "Radisson - Lisboa 1" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                },
                {
                    "leader": "Mike",
                    "location": "Novotel - Zalor",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "TIP Eng Meeting", "participants": "Ayush, Ragini, SK, Sadhanna" },
                        { "time": "4:00 - 4:50 PM", "title": "Cost Point QA Updates", "participants": "Bindu + Shreyans + Nelson + Nitin + Vijay + Mike + Dinakar + Hardik + Online Matt, Leo, Janet, JV, JP, Joms, CP QE Mgr + Jeevan", "location": "Radisson Blu - Sintra" },
                        { "time": "5:00 - 5:50 PM", "title": "1-1 Bindu Parvathy (25 Mins)\n1-1 Nitin Sureka (25 Mins)", "participants": "Nitin, Bindu" },
                        { "time": "6:00 - 6:25 PM", "title": "Meeting with CP QE Team", "participants": "Bindu's Org + Nelson" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's", "location": "Radisson - Lisboa 1" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                },
                {
                    "leader": "Hardik",
                    "location": "Novotel - Kabab n Kuries",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "1:1 VP Team", "participants": "Hardik's team" },
                        { "time": "4:00 - 4:50 PM", "title": "Cost Point QA Updates", "participants": "Bindu + Shreyans + Nelson + Nitin + Vijay + Mike + Dinakar + Hardik + Online Matt, Leo, Janet, JV, JP, Joms, CP QE Mgr + Jeevan", "location": "Radisson Blu - Sintra" },
                        { "time": "5:00 - 5:50 PM", "title": "Free Time (25 Mins)\nMeeting with HR BP (25 Mins)", "participants": "Nitin, HR BP" },
                        { "time": "6:00 - 6:25 PM", "title": "AI Adoption and SDLC process", "participants": "Hardik's team" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's", "location": "Radisson - Lisboa 1" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                },
                {
                    "leader": "Bret & Robert",
                    "location": "Radisson - Sagres 1",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "PST Townhall", "participants": "TBD" },
                        { "time": "4:00 - 4:50 PM", "title": "Replicon Team Connect", "participants": "TBD" },
                        { "time": "5:00 - 5:50 PM", "title": "Replicon Team Connect", "participants": "TBD" },
                        { "time": "6:00 - 6:25 PM", "title": "Free Time", "participants": "TBD" },
                        { "time": "6:30 - 6:55 PM", "title": "Free Time", "participants": "TBD" },
                        { "time": "7:00 - 7:30 PM", "title": "Free Time", "participants": "TBD" }
                    ]
                },
                {
                    "leader": "Badri",
                    "location": "Radisson - Lisboa 1",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "Vijay's All Hands", "participants": "Vijay's Org" },
                        { "time": "4:00 - 4:50 PM", "title": "Badri's Team Meeting", "participants": "Badri's Team", "location": "Radisson - Porto" },
                        { "time": "5:00 - 5:50 PM", "title": "Badri's 1-1 Meetings", "participants": "Badri's Team", "location": "Radisson - Porto" },
                        { "time": "6:00 - 6:25 PM", "title": "Shared Services Team Meeting", "participants": "Kavya's Team, Badri's Team, Nitin S, Vijay, Dinakar, Jogesh, Swapnil, Abdul" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                },
                {
                    "leader": "Enrique",
                    "location": "Radisson - Lisboa 1",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "Vijay's All Hands", "participants": "Vijay's Org" },
                        { "time": "4:00 - 4:50 PM", "title": "Enrique's Team Meeting (Core & Integration) - 25 Mins\nEnrique's Team Meeting (Polaris & ZeroTime) - 25 Mins", "participants": "Enrique + Prasanna's Org\nEnrique + Nitin V's Org", "location": "Radisson - Lisboa 2" },
                        { "time": "5:00 - 5:50 PM", "title": "Replicon Product Meetings", "participants": "Enrique's Team + Vijay + Dinakar" },
                        { "time": "6:00 - 6:25 PM", "title": "Enrique's Team Meeting (QA)", "participants": "Enrique + Ranjan's Org", "location": "Radisson - Lisboa 2" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                },
                {
                    "leader": "Steve",
                    "location": "Radisson - Braga",
                    "sessions": [
                        { "time": "3:00 - 3:50 PM", "title": "PPM All Hands", "participants": "PPM Eng + PDM (Rob)" },
                        { "time": "4:00 - 4:50 PM", "title": "PPM NextGen Acceleration", "participants": "PPM Eng + PDM (Rob) + QA (PPM) + Kavya +DevOps" },
                        { "time": "5:00 - 5:50 PM", "title": "Steve's Team Discussions", "participants": "PPM Eng + QA (PPM) + Kavya" },
                        { "time": "6:00 - 6:25 PM", "title": "AI Transformation - SDLC & Product", "participants": "PPM Eng + PDM (Rob) + QA (PPM) +DevOps (Basu Chadda, Suresh, Chaitanya, Bhanu Ranjan)" },
                        { "time": "6:30 - 6:55 PM", "title": "All Manager+Architect's Meeting", "participants": "All Manager+Architect's", "location": "Radisson - Lisboa 1" },
                        { "time": "7:00 - 7:30 PM", "title": "Closing Ceremony", "participants": "Everyone", "location": "Novotel - Grand Ball Room" }
                    ]
                }
            ]
        }
    ],
    "5": [
        {
            "id": 29,
            "session": "Hotel Check-out & Departure",
            "category": "Departure",
            "speaker": "",
            "startTime": "TBD",
            "endTime": "TBD",
            "location": "Hotel Lobbies",
            "description": "Please check out from your respective hotels. Thank you for attending Deltek India Reconnect 2025!",
            "objectives": ["Complete hotel check-out", "Safe travels"],
            "materials": [],
            "tags": ["Departure", "Check-out"]
        }
    ]
};
export const DEFAULT_STORED_DATA = {
    agendaData: DEFAULT_AGENDA_DATA,
    startDate: DEFAULT_START_DATE.toISOString(),
    lastModified: new Date().toISOString(),
};
export const VENUE_LOCATIONS = {
    // Novotel Locations
    'novotel ballroom': { name: "Novotel Ballroom", description: "Main conference hall at Novotel Resort", mapId: 'novotelResort', coords: { x: 77, y: 75, width: 17, height: 13.5 } },
    'seagull restaurant (novotel)': { name: "Seagull Restaurant", description: "Dining venue at Novotel Resort", mapId: 'novotelResort', coords: { x: 66, y: 53, width: 10, height: 20 } },
    'novotel lobby': { name: "Novotel Lobby", description: "Main entrance and registration area", mapId: 'novotelResort', coords: { x: 77, y: 53, width: 17, height: 20 } },
    'novotel - zalor': { name: "Zalor @ Novotel", description: "Meeting space (Tia Maria) at Novotel", mapId: 'novotelResort', coords: { x: 81, y: 16.5, width: 4, height: 10 } },
    'novotel - kabab n kuries': { name: "Kabab n Kuries @ Novotel", description: "Dining venue at Novotel", mapId: 'novotelResort', coords: { x: 86, y: 13, width: 9, height: 4 } },
    'seaside lawn area': { name: "Seaside Lawn Area", description: "Outdoor event space near the beach", mapId: 'novotelResort', coords: { x: 20, y: 20, width: 40, height: 40 } },
    'novotel resort general': { name: "Novotel Resort Layout", description: "General overview of the Novotel Resort", mapId: 'novotelResort', coords: { x: 0, y: 0, width: 0, height: 0 } },
    'novotel - grand ballroom': { name: "Novotel Ballroom", description: "Main conference hall at Novotel Resort", mapId: 'novotelResort', coords: { x: 77, y: 75, width: 17, height: 13.5 } },
    // Radisson Blu Locations
    'radisson blu - sintra': { name: "Sintra @ Radisson Blu", description: "Conference hall in the main block", mapId: 'mainBlock', coords: { x: 32, y: 20, width: 36, height: 25 } },
    'radisson - lisboa 1': { name: "Lisboa 1 @ Radisson Blu", description: "Conference hall in the main block", mapId: 'mainBlock', coords: { x: 32.5, y: 80, width: 18, height: 10 } },
    'raddison blu lobby': { name: "Radisson Blu Lobby", description: "Main entrance and registration area", mapId: 'mainBlock', coords: { x: 32.5, y: 67, width: 35, height: 10 } },
    'raddison - braga': { name: "Braga @ Radisson Blu", description: "Meeting room in the Villas section", mapId: 'villas', coords: { x: 2, y: 24, width: 10, height: 10 } },
    'raddison - sagres 1': { name: "Sagres 1 @ Radisson Blu", description: "Meeting room in the Villas section", mapId: 'villas', coords: { x: 77, y: 12, width: 18, height: 10 } },
    'radisson - porto': { name: "Porto @ Radisson Blu", description: "Meeting room in the main block", mapId: 'mainBlock', coords: { x: 52, y: 80, width: 15, height: 10 } },
    'radisson - lisboa 2': { name: "Lisboa 2 @ Radisson Blu", description: "Conference hall in the main block", mapId: 'mainBlock', coords: { x: 32.5, y: 92, width: 35, height: 8 } },
    // General Accommodation Maps
    'main block accommodations': { name: "Main Block Rooms", description: "Superior Rooms, North & South Wing", mapId: 'mainBlock', coords: { x: 0, y: 0, width: 0, height: 0 } },
    'villa accommodations': { name: "Villa Rooms", description: "Premium Rooms and Suites", mapId: 'villas', coords: { x: 0, y: 0, width: 0, height: 0 } },
};
