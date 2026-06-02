import React from 'react'

export default function About() {
    return (
        <header className="hero">
            <div className="page">
                <h2>About CollegeHub</h2>
                <p>
                    CollegeHub is a minimal college management system focused on
                    simple, useful features: student records, performance tracking,
                    and library management. This demo keeps the UI light and
                    accessible.
                </p>

                <div className="about-copy" style={{marginTop:24}}>
                    <h3>Our Vision & Mission</h3>
                    <p>
                        Vision: To empower students and educators with a simple,
                        reliable platform that makes campus life and learning more
                        efficient and accessible. Mission: Build intuitive tools
                        that reduce administrative overhead, surface actionable
                        insights, and help institutions focus on teaching and
                        student success. Goals: Offer a lightweight, maintainable
                        system for managing records, communications, and basic
                        campus services with minimal setup.
                    </p>
                </div>
            </div>
        </header>
    )
}
