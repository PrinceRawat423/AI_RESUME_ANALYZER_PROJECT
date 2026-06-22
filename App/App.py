import base64
import datetime as dt
import io
import os
import platform
import random
import secrets
import socket
import time
from pathlib import Path

import pandas as pd
import plotly.express as px
import streamlit as st
from geopy.geocoders import Nominatim
from pdfminer.high_level import extract_text
from PIL import Image

try:
    import geocoder
except Exception:
    geocoder = None

try:
    import pymysql
except Exception:
    pymysql = None

try:
    from pyresparser import ResumeParser
except Exception:
    ResumeParser = None

try:
    from streamlit_tags import st_tags
except Exception:
    st_tags = None

from Courses import android_course, ds_course, interview_videos, ios_course, resume_videos, uiux_course, web_course

APP_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = APP_DIR / "Uploaded_Resumes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

st.set_page_config(page_title="AI Resume Analyzer", page_icon="📄", layout="wide")

SKILL_LIBRARY = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "react js",
    "node",
    "node js",
    "django",
    "flask",
    "streamlit",
    "tensorflow",
    "keras",
    "pytorch",
    "machine learning",
    "deep learning",
    "android",
    "flutter",
    "kotlin",
    "ios",
    "swift",
    "ui",
    "ux",
    "figma",
    "adobe xd",
    "wireframe",
    "prototyping",
    "sql",
    "mysql",
    "postgresql",
    "git",
    "github",
    "communication",
    "leadership",
    "problem solving",
    "teamwork",
]


def get_connection():
    if pymysql is None:
        return None
    try:
        return pymysql.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", "root@MySQL4admin"),
            db=os.getenv("MYSQL_DB", "cv"),
        )
    except Exception:
        return None


def init_db():
    conn = get_connection()
    if not conn:
        return None
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS cv;")
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS user_data (
            ID INT NOT NULL AUTO_INCREMENT,
            sec_token varchar(20) NOT NULL,
            ip_add varchar(50) NULL,
            host_name varchar(50) NULL,
            dev_user varchar(50) NULL,
            os_name_ver varchar(50) NULL,
            latlong varchar(50) NULL,
            city varchar(50) NULL,
            state varchar(50) NULL,
            country varchar(50) NULL,
            act_name varchar(50) NOT NULL,
            act_mail varchar(50) NOT NULL,
            act_mob varchar(20) NOT NULL,
            Name varchar(500) NOT NULL,
            Email_ID VARCHAR(500) NOT NULL,
            resume_score VARCHAR(8) NOT NULL,
            Timestamp VARCHAR(50) NOT NULL,
            Page_no VARCHAR(5) NOT NULL,
            Predicted_Field BLOB NOT NULL,
            User_level BLOB NOT NULL,
            Actual_skills BLOB NOT NULL,
            Recommended_skills BLOB NOT NULL,
            Recommended_courses BLOB NOT NULL,
            pdf_name varchar(50) NOT NULL,
            PRIMARY KEY (ID)
        );
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS user_feedback (
            ID INT NOT NULL AUTO_INCREMENT,
            feed_name varchar(50) NOT NULL,
            feed_email VARCHAR(50) NOT NULL,
            feed_score VARCHAR(5) NOT NULL,
            comments VARCHAR(100) NULL,
            Timestamp VARCHAR(50) NOT NULL,
            PRIMARY KEY (ID)
        );
        """
    )
    conn.commit()
    return conn


def parse_pdf(file_path):
    try:
        return extract_text(file_path) or ""
    except Exception:
        return ""


def show_pdf(file_path):
    with open(file_path, "rb") as f:
        base64_pdf = base64.b64encode(f.read()).decode("utf-8")
    pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="700" height="900" type="application/pdf"></iframe>'
    st.markdown(pdf_display, unsafe_allow_html=True)


def analyze_resume_text(resume_text):
    text = resume_text.lower()
    skills = [skill for skill in SKILL_LIBRARY if skill in text]
    return skills


def detect_field(skills, resume_text):
    text = resume_text.lower()
    if any(k in text for k in ["tensorflow", "keras", "pytorch", "machine learning", "deep learning", "flask", "streamlit"]):
        return "Data Science", ds_course, [
            "Data Visualization",
            "Predictive Analysis",
            "Statistical Modeling",
            "Data Mining",
            "Clustering & Classification",
            "Data Analytics",
            "Quantitative Analysis",
            "Web Scraping",
            "ML Algorithms",
            "Keras",
            "PyTorch",
            "Probability",
            "Scikit-learn",
            "Tensorflow",
            "Flask",
            "Streamlit",
        ]
    if any(k in text for k in ["react", "django", "node js", "node.js", "php", "laravel", "wordpress", "javascript", "angular", "html", "css"]):
        return "Web Development", web_course, [
            "React",
            "Django",
            "Node JS",
            "React JS",
            "php",
            "laravel",
            "Magento",
            "wordpress",
            "Javascript",
            "Angular JS",
            "c#",
            "Flask",
            "SDK",
        ]
    if any(k in text for k in ["android", "flutter", "kotlin", "xml", "kivy"]):
        return "Android Development", android_course, [
            "Android",
            "Android development",
            "Flutter",
            "Kotlin",
            "XML",
            "Java",
            "Kivy",
            "GIT",
            "SDK",
            "SQLite",
        ]
    if any(k in text for k in ["ios", "swift", "cocoa", "xcode"]):
        return "IOS Development", ios_course, [
            "IOS",
            "IOS Development",
            "Swift",
            "Cocoa",
            "Cocoa Touch",
            "Xcode",
            "Objective-C",
            "SQLite",
            "Plist",
            "StoreKit",
            "UI-Kit",
            "AV Foundation",
            "Auto-Layout",
        ]
    if any(k in text for k in ["ux", "ui", "adobe xd", "figma", "zeplin", "balsamiq", "wireframe", "prototyping", "user research"]):
        return "UI-UX Development", uiux_course, [
            "UI",
            "User Experience",
            "Adobe XD",
            "Figma",
            "Zeplin",
            "Balsamiq",
            "Prototyping",
            "Wireframes",
            "Storyframes",
            "Adobe Photoshop",
            "Editing",
            "Illustrator",
            "After Effects",
            "Premier Pro",
            "Indesign",
            "Wireframe",
            "Solid",
            "Grasp",
            "User Research",
        ]
    return "NA", [], ["No Recommendations"]


def course_recommender(course_list):
    st.subheader("Courses & Certificates Recommendations")
    no_of_reco = st.slider("Choose Number of Course Recommendations:", 1, 10, 5)
    picked = []
    random.shuffle(course_list)
    for i, (name, link) in enumerate(course_list[:no_of_reco], start=1):
        st.markdown(f"{i}. [{name}]({link})")
        picked.append(name)
    return picked


def insert_user_data(conn, values):
    if not conn:
        return
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO user_data
        VALUES (0,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        values,
    )
    conn.commit()


def insert_feedback(conn, values):
    if not conn:
        return
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO user_feedback
        VALUES (0,%s,%s,%s,%s,%s)
        """,
        values,
    )
    conn.commit()


def render_pdf_uploader():
    st.markdown("##### Upload Your Resume, And Get Smart Recommendations")
    pdf_file = st.file_uploader("Choose your Resume", type=["pdf"])
    return pdf_file


def get_location_info():
    city = state = country = "Unknown"
    latlong = ""
    try:
        if geocoder is not None:
            g = geocoder.ip("me")
            latlong = str(getattr(g, "latlng", "") or "")
            if latlong:
                geolocator = Nominatim(user_agent="ai_resume_analyzer")
                location = geolocator.reverse(latlong, language="en", timeout=10)
                if location and hasattr(location, "raw"):
                    address = location.raw.get("address", {})
                    city = address.get("city", city)
                    state = address.get("state", state)
                    country = address.get("country", country)
    except Exception:
        pass
    return latlong, city, state, country


def show_download_link(df, filename, text):
    csv = df.to_csv(index=False)
    b64 = base64.b64encode(csv.encode()).decode()
    href = f'<a href="data:file/csv;base64,{b64}" download="{filename}">{text}</a>'
    st.markdown(href, unsafe_allow_html=True)


def get_csv_download_link(df, filename, text):
    return show_download_link(df, filename, text)


def skill_pills(skills, key):
    if st_tags is not None:
        return st_tags(label=" ", text="", value=skills, key=key)
    st.write(", ".join(skills) if skills else "No skills detected")
    return skills


def main():
    conn = init_db()

    st.title("AI RESUME ANALYZER")
    st.caption("A Tool for Resume Analysis, Predictions and Recommendations")
    st.sidebar.markdown("# Choose Something...")
    activities = ["User", "Feedback", "About", "Admin"]
    choice = st.sidebar.selectbox("Choose among the given options:", activities)
    st.sidebar.markdown("Built with Streamlit-style workflow")

    if choice == "User":
        act_name = st.text_input("Name*")
        act_mail = st.text_input("Mail*")
        act_mob = st.text_input("Mobile Number*")
        sec_token = secrets.token_urlsafe(12)
        host_name = socket.gethostname()
        try:
            ip_add = socket.gethostbyname(host_name)
        except Exception:
            ip_add = "Unknown"
        try:
            dev_user = os.getlogin()
        except Exception:
            dev_user = os.getenv("USERNAME", "Unknown")
        os_name_ver = platform.system() + " " + platform.release()
        latlong, city, state, country = get_location_info()

        pdf_file = render_pdf_uploader()

        if pdf_file is not None:
            save_path = UPLOAD_DIR / pdf_file.name
            with open(save_path, "wb") as f:
                f.write(pdf_file.getbuffer())

            with st.spinner("Hang On While We Cook Magic For You..."):
                time.sleep(1)
                show_pdf(str(save_path))

                if ResumeParser is not None:
                    try:
                        resume_data = ResumeParser(str(save_path)).get_extracted_data()
                    except Exception:
                        resume_data = None
                else:
                    resume_data = None

                resume_text = parse_pdf(str(save_path))
                detected_skills = (
                    [skill.lower() for skill in resume_data.get("skills", [])]
                    if resume_data and resume_data.get("skills")
                    else analyze_resume_text(resume_text)
                )

                st.header("Resume Analysis")
                if resume_data and resume_data.get("name"):
                    st.success(f"Hello {resume_data.get('name')}")
                else:
                    st.success("Hello Candidate")

                st.subheader("Your Basic info")
                name = resume_data.get("name") if resume_data else act_name or "Unknown"
                email = resume_data.get("email") if resume_data else act_mail or ""
                mobile = resume_data.get("mobile_number") if resume_data else act_mob or ""
                degree = str(resume_data.get("degree")) if resume_data and resume_data.get("degree") else "Not specified"
                pages = int(resume_data.get("no_of_pages")) if resume_data and resume_data.get("no_of_pages") else 1

                st.text(f"Name: {name}")
                st.text(f"Email: {email}")
                st.text(f"Contact: {mobile}")
                st.text(f"Degree: {degree}")
                st.text(f"Resume pages: {pages}")

                cand_level = "Fresher"
                lower_text = resume_text.lower()
                if pages < 1:
                    cand_level = "NA"
                    st.markdown("#### You are at Fresher level!")
                elif "internship" in lower_text:
                    cand_level = "Intermediate"
                    st.markdown("#### You are at intermediate level!")
                elif "experience" in lower_text or "work experience" in lower_text:
                    cand_level = "Experienced"
                    st.markdown("#### You are at experience level!")
                else:
                    st.markdown("#### You are at Fresher level!!")

                st.subheader("Skills Recommendation")
                skill_pills(detected_skills, "detected_skills")
                reco_field, course_list, recommended_skills = detect_field(detected_skills, resume_text)
                if reco_field != "NA":
                    st.success(f"Our analysis says you are looking for {reco_field} Jobs.")
                else:
                    st.warning("Currently our tool only predicts and recommends for Data Science, Web, Android, IOS and UI/UX Development")

                st.markdown("##### Adding these skills to your resume will boost the chances of getting a job")
                skill_pills(recommended_skills, "recommended_skills")
                rec_course = course_recommender(course_list) if course_list else ["Sorry! Not Available for this Field"]

                st.subheader("Resume Tips & Ideas")
                resume_score = 0
                tips = []
                if "objective" in lower_text or "summary" in lower_text:
                    resume_score += 6
                    tips.append("Awesome! You have added Objective/Summary")
                else:
                    tips.append("Please add your career objective, it will give your career intention to the Recruiters.")
                if any(word in lower_text for word in ["education", "school", "college"]):
                    resume_score += 12
                    tips.append("Awesome! You have added Education Details")
                else:
                    tips.append("Please add Education details.")
                if "skills" in lower_text:
                    resume_score += 15
                    tips.append("You have added Skills section.")
                else:
                    tips.append("Add a proper Skills section.")
                if "hobbies" in lower_text or "interests" in lower_text:
                    resume_score += 3
                    tips.append("You have added Hobbies/Interests.")
                if "achievements" in lower_text:
                    resume_score += 6
                    tips.append("Great! You added achievements.")
                if "experience" in lower_text:
                    resume_score += 13
                    tips.append("Experience section found.")
                if "projects" in lower_text:
                    resume_score += 12
                    tips.append("Projects section found.")
                if "accomplishments" in lower_text:
                    resume_score += 6
                    tips.append("Accomplishments section found.")
                if "certifications" in lower_text:
                    resume_score += 5
                    tips.append("Certifications section found.")

                score = min(100, resume_score + len(detected_skills) * 4 + pages * 2)
                st.metric("Overall Score", score)
                for tip in tips:
                    st.markdown(f"##### {'[+]' if 'Please' not in tip and 'Add' not in tip else '[-]'} {tip}")

                st.subheader("Interview & Resume Tip Videos")
                st.markdown("###### Resume videos")
                for video, link in resume_videos:
                    st.markdown(f"- [{video}]({link})")
                st.markdown("###### Interview videos")
                for video, link in interview_videos:
                    st.markdown(f"- [{video}]({link})")

                ts = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                try:
                    insert_user_data(
                        conn,
                        (
                            sec_token,
                            ip_add,
                            host_name,
                            dev_user,
                            os_name_ver,
                            latlong,
                            city,
                            state,
                            country,
                            act_name or name,
                            act_mail or email,
                            act_mob or mobile,
                            name,
                            email,
                            str(score),
                            ts,
                            str(pages),
                            reco_field,
                            cand_level,
                            ", ".join(detected_skills),
                            ", ".join(recommended_skills),
                            ", ".join(rec_course),
                            pdf_file.name,
                        ),
                    )
                except Exception as ex:
                    st.warning(f"Database save skipped: {ex}")

                st.success("Analysis complete.")

    elif choice == "Feedback":
        st.header("Feedback")
        feed_name = st.text_input("Name")
        feed_email = st.text_input("Email")
        feed_score = st.slider("Rating from 1 to 5", 1, 5, 5)
        comments = st.text_area("Comments")
        if st.button("Submit Feedback"):
            ts = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            try:
                insert_feedback(conn, (feed_name, feed_email, str(feed_score), comments, ts))
                st.success("Thanks for your feedback!")
            except Exception as ex:
                st.warning(f"Feedback not saved: {ex}")

        try:
            if conn:
                df = pd.read_sql("SELECT * FROM user_feedback ORDER BY ID DESC", conn)
                st.dataframe(df, use_container_width=True)
                fig = px.pie(df, names="feed_score", title="Ratings")
                st.plotly_chart(fig, use_container_width=True)
        except Exception:
            st.info("No feedback history available yet.")

    elif choice == "About":
        st.image(
            Image.new("RGB", (1200, 260), color="white"),
            caption="Best View in Light Mode and Desktop Site (Recommended)",
        )
        st.markdown("# AI RESUME ANALYZER")
        st.markdown("A Tool for Resume Analysis, Predictions and Recommendations")
        st.write(
            "A tool which parses information from a resume using natural language processing and finds the keywords, "
            "cluster them onto sectors based on their keywords. And lastly show recommendations, predictions, analytics "
            "to the applicant / recruiter based on keyword matching."
        )
        st.subheader("Scope")
        st.markdown("1. It can be used for getting all the resume data into a structured tabular format and csv as well.")
        st.markdown("2. By providing recommendations, predictions and overall score user can improve their resume.")
        st.markdown("3. It can increase more traffic to our tool because of user section.")
        st.markdown("4. It can be used by colleges to get insight of students and their resume before placements.")
        st.markdown("5. Also, to get analytics for roles which users are mostly looking for.")
        st.markdown("6. To improve this tool by getting feedbacks.")
        st.subheader("Tech Stack")
        st.write("Frontend: Streamlit, HTML, CSS, JavaScript")
        st.write("Backend: Streamlit + Python")
        st.write("Database: MySQL")
        st.write("Modules: pandas, pyresparser, pdfminer3, plotly, nltk")

    elif choice == "Admin":
        st.header("Admin Dashboard")
        try:
            if conn:
                user_df = pd.read_sql("SELECT * FROM user_data ORDER BY ID DESC", conn)
                st.dataframe(user_df, use_container_width=True)
                st.subheader("Download data")
                get_csv_download_link(user_df, "user_data.csv", "Download CSV")

                st.subheader("Analytics")
                col1, col2 = st.columns(2)
                with col1:
                    if "Predicted_Field" in user_df.columns:
                        st.plotly_chart(px.pie(user_df, names="Predicted_Field", title="Predicted field / roles"), use_container_width=True)
                    if "User_level" in user_df.columns:
                        st.plotly_chart(px.pie(user_df, names="User_level", title="Experience level"), use_container_width=True)
                with col2:
                    if "resume_score" in user_df.columns:
                        st.plotly_chart(px.pie(user_df, names="resume_score", title="Resume score"), use_container_width=True)
                    if "city" in user_df.columns:
                        st.plotly_chart(px.pie(user_df, names="city", title="City"), use_container_width=True)

                st.subheader("Saved PDF Files")
                st.write(list((UPLOAD_DIR).glob("*.pdf"))[:25])
        except Exception as ex:
            st.info(f"No admin data available yet: {ex}")


if __name__ == "__main__":
    main()
