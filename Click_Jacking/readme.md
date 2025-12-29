#  Clickjacking Demonstration 

## Overview
This repository contains a demonstration of a **Clickjacking Attack** using a vulnerable website and an attacker website. Clickjacking is a malicious technique where an attacker tricks a user into clicking on something different from what the user perceives, potentially leading to unauthorized actions.

## 📁 Project Structure
- **vulnerable_website.html**: The vulnerable website that hosts an iframe pointing to the attacker website.
- **attacker_website.html**: The attacker's website that performs the clickjacking attack by overlaying a transparent button over the content.

##  How It Works
1. **Vulnerable Website**: 
   - The `vulnerable_website.html` file contains an iframe that loads the `attacker_website.html`. This allows the attacker to manipulate the user's interaction with the vulnerable site.

2. **Attacker Website**:
   - The `attacker_website.html` file includes a transparent button that covers the visible content. When the user clicks on the button, it triggers a download of a malicious file and can also send sensitive data (like cookies) to the attacker's server.

3. **Demonstration**:
   - When a user visits the vulnerable website and clicks the button, they unknowingly interact with the attacker website, which can lead to data theft or unwanted downloads.

## Setup Instructions
To run this demonstration locally, follow these steps:

1. Clone the repository:

2. Open `vulnerable_website.html` in your web browser.

3. Ensure that the attacker website is hosted on a local server (e.g., using Live Server in VSCode).

4. Interact with the vulnerable website to see the clickjacking in action!

## ⚠️ Important Note
This demonstration is for educational purposes only. Do not use this knowledge for malicious activities. Always ensure that your applications are protected against such vulnerabilities.


---
