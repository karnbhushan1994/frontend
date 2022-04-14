import * as React from 'react';

import { Linking, StyleSheet, Text } from 'react-native';

import { TAGG_WEBSITE } from '../../constants';

const TermsAndConditionsText: React.FC = () => {
  const textWithBulletPoint = (data: string, style: object) => (
    <Text style={style}>{`\u2022 ${data}`}</Text>
  );

  return (
    <React.Fragment>
      <Text style={styles.bold}>
        Last updated: <Text style={styles.unbold}>November 6, 2020</Text>
      </Text>
      <Text style={styles.para}>
        Please read these terms and conditions carefully before using Our Service.
      </Text>
      <Text style={styles.heading}>Interpretation and Definitions</Text>
      <Text style={styles.subHeading}>Interpretation</Text>
      <Text style={styles.para}>
        The words of which the initial letter is capitalized have meanings defined under the
        following conditions.
      </Text>
      <Text style={styles.para}>
        The following definitions shall have the same meaning regardless of whether they appear in
        singular or in plural.
      </Text>
      <Text style={styles.subHeading}>Definitions</Text>
      <Text style={styles.para}>For the purposes of these Terms of Service:</Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Application</Text> means the software program provided by the
        Company downloaded by You on any electronic device, named Tagg
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Application Store</Text> means the digital distribution service
        operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in
        which the Application has been downloaded.
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Affiliate</Text> means an entity that controls, is controlled by
        or is under common control with a party, where "control" means ownership of 50% or more of
        the shares, equity interest or other securities entitled to vote for election of directors
        or other managing authority.
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Account</Text> means a unique account created for You to access
        our Service or parts of our Service.
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Company</Text> (referred to as either "the Company", "We", "Us" or
        "Our" in this Agreement) refers to TaggiD, Inc., 7026 Argonne Trail, TX 77479.
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Content</Text> refers to content such as text, images, or other
        information that can be posted, uploaded, linked to, or otherwise made available by You,
        regardless of the form of that content.
      </Text>
      <Text style={styles.paraLeftAlign}>
        <Text style={styles.bold}>Country</Text> refers to: Texas, United States
      </Text>
      <Text style={styles.paraLeftAlign}>
        <Text style={styles.bold}>Device </Text> means any device that can access the Service such
        as a computer, a cellphone, or a digital tablet.
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Feedback</Text> means feedback, innovations or suggestions sent by
        You regarding the attributes, performance or features of our Service.
      </Text>
      <Text style={styles.paraLeftAlign}>
        <Text style={styles.bold}>Service</Text> refers to the Application.
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Terms of Service</Text> (also referred as "Terms") mean these
        Terms of Service that form the entire agreement between You and the Company regarding the
        use of the Service.
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>Third-party Social Media Service</Text> means any services or
        content (including data, information, products, or services) provided by a third-party that
        may be displayed, included, or made available by the Service.
      </Text>
      <Text style={styles.para}>
        <Text style={styles.bold}>You</Text> means the individual accessing or using the Service, or
        the company, or other legal entity on behalf of which such individual is accessing or using
        the Service, as applicable.
      </Text>
      <Text style={styles.heading}>Acknowledgement</Text>
      <Text style={styles.para}>
        These are the Terms of Service governing the use of this Service and the agreement that
        operates between You and the Company. These Terms of Service set out the rights and
        obligations of all users regarding the use of the Service.
      </Text>
      <Text style={styles.para}>
        Your access to and use of the Service is conditioned on Your acceptance of and compliance
        with these Terms of Service. These Terms of Service apply to all visitors, users and others
        who access or use the Service.
      </Text>
      <Text style={styles.para}>
        By accessing or using the Service You agree to be bound by these Terms of Service. If You
        disagree with any part of these Terms of Service then You may not access the Service.
      </Text>
      <Text style={styles.para}>
        You represent that you are over the age of 13. The Company does not permit those under 13 to
        use the Service.
      </Text>
      <Text style={styles.para}>
        Your access to and use of the Service is also conditioned on Your acceptance of and
        compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies
        and procedures on the collection, use and disclosure of Your personal information when You
        use the Application or the Website and tells You about Your privacy rights and how the law
        protects You. Please read Our Privacy Policy carefully before using Our Service.
      </Text>
      <Text style={styles.heading}>User Accounts</Text>
      <Text style={styles.para}>
        When You create an account with Us, You must provide Us information that is accurate,
        complete, and current at all times. Failure to do so constitutes a breach of the Terms,
        which may result in immediate termination of Your account on Our Service.
      </Text>
      <Text style={styles.para}>
        You are responsible for safeguarding the password that You use to access the Service and for
        any activities or actions under Your password, whether Your password is with Our Service or
        a Third-Party Social Media Service.
      </Text>
      <Text style={styles.para}>
        You agree not to disclose Your password to any third party. You must notify Us immediately
        upon becoming aware of any breach of security or unauthorized use of Your account.
      </Text>
      <Text style={styles.para}>
        You may not use as a username the name of another person or entity or that is not lawfully
        available for use, a name or trademark that is subject to any rights of another person or
        entity other than You without appropriate authorization, or a name that is otherwise
        offensive, vulgar or obscene.
      </Text>
      <Text style={styles.para}>
        You may not copy, modify, distribute, sell, or lease any part of our Services, nor may You
        reverse engineer or attempt to extract the source code of that software, unless laws
        prohibit these restrictions or You have our written permission to do so.
      </Text>
      <Text style={styles.para}>
        As our Application or Website allows You the option of connecting your social media
        accounts, it’s information and content to your user account, You grant Us permission to
        display content You have made private on other social media sites as public on our
        Application or Website if You have elected to have a public account on our Application or
        Website.
      </Text>
      <Text style={styles.heading}>Content</Text>
      <Text style={styles.subHeading}>Your Right to Post Content</Text>
      <Text style={styles.para}>
        Our Service allows You to post Content. You are responsible for the Content that You post to
        the Service, including its legality, reliability, and appropriateness.
      </Text>
      <Text style={styles.para}>
        By posting Content to the Service, You grant Us the right and license to use, modify,
        publicly perform, publicly display, reproduce, and distribute such Content on and through
        the Service. You retain any and all of Your rights to any Content You submit, post or
        display on or through the Service and You are responsible for protecting those rights. You
        agree that this license includes the right for Us to make Your Content available to other
        users of the Service, who may also use Your Content subject to these Terms.
      </Text>
      <Text style={styles.para}>
        You represent and warrant that: (i) the Content is Yours (You own it) or You have the right
        to use it and grant Us the rights and license as provided in these Terms, and (ii) the
        posting of Your Content on or through the Service does not violate the privacy rights,
        publicity rights, copyrights, contract rights or any other rights of any person.
      </Text>
      <Text style={styles.subHeading}>Content Restrictions</Text>
      <Text style={styles.para}>
        The Company is not responsible for the content of the Service's users. You expressly
        understand and agree that You are solely responsible for the Content and for all activity
        that occurs under your account, whether done so by You or any third person using Your
        account.
      </Text>
      <Text style={styles.para}>
        You may not transmit any Content that is unlawful, offensive, upsetting, intended to
        disgust, threatening, libelous, defamatory, obscene or otherwise objectionable. Examples of
        such objectionable Content include, but are not limited to, the following:
      </Text>
      {textWithBulletPoint('Unlawful or promoting unlawful activity.', styles.paraLeftAlign)}
      {textWithBulletPoint(
        'Defamatory, discriminatory, or mean-spirited content, including references or commentary about religion, race, sexual orientation, gender, national/ethnic origin, or other targeted groups.',
        styles.para,
      )}
      {textWithBulletPoint(
        'Spam, machine – or randomly – generated, constituting unauthorized or unsolicited advertising, chain letters, any other form of unauthorized solicitation, or any form of lottery or gambling.',
        styles.para,
      )}
      {textWithBulletPoint(
        'Containing or installing any viruses, worms, malware, trojan horses, or other content that is designed or intended to disrupt, damage, or limit the functioning of any software, hardware or telecommunications equipment or to damage or obtain unauthorized access to any data or other information of a third person.',
        styles.para,
      )}
      {textWithBulletPoint(
        'Infringing on any proprietary rights of any party, including patent, trademark, trade secret, copyright, right of publicity or other rights.',
        styles.para,
      )}
      {textWithBulletPoint(
        'Impersonating any person or entity including the Company and its employees or representatives.',
        styles.paraLeftAlign,
      )}
      {textWithBulletPoint('Violating the privacy of any third person.', styles.paraLeftAlign)}
      {textWithBulletPoint('False information and features.', styles.paraLeftAlign)}
      <Text style={styles.para}>
        The Company reserves the right, but not the obligation, to, in its sole discretion,
        determine whether or not any Content is appropriate and complies with this Terms, refuse or
        remove this Content. The Company further reserves the right to make formatting and edits and
        change the manner any Content. The Company can also limit or revoke the use of the Service
        if You post such objectionable Content. As the Company cannot control all content posted by
        users and/or third parties on the Service, you agree to use the Service at your own risk.You
        understand that by using the Service You may be exposed to content that You may find
        offensive, indecent, incorrect or objectionable, and You agree that under no circumstances
        will the Company be liable in any way for any content, including any errors or omissions in
        any content, or any loss or damage of any kind incurred as a result of your use of any
        content.
      </Text>
      <Text style={styles.para}>
        Tagg looks to foster a friendly network of users and therefore has a zero-tolerance policy
        for abusive users. In the event that a user exhibits objectionable or abusive behaviour, the
        Company shall remove that user from the network immediately.
      </Text>
      <Text style={styles.subHeading}>Content Backups</Text>
      <Text style={styles.para}>
        Although regular backups of Content are performed, the Company do not guarantee there will
        be no loss or corruption of data.
      </Text>
      <Text style={styles.para}>
        Corrupt or invalid backup points may be caused by, without limitation, Content that is
        corrupted prior to being backed up or that changes during the time a backup is performed.
      </Text>
      <Text style={styles.para}>
        The Company will provide support and attempt to troubleshoot any known or discovered issues
        that may affect the backups of Content. But You acknowledge that the Company has no
        liability related to the integrity of Content or the failure to successfully restore Content
        to a usable state.
      </Text>
      <Text style={styles.para}>
        You agree to maintain a complete and accurate copy of any Content in a location independent
        of the Service.
      </Text>
      <Text style={styles.heading}>Software License</Text>
      <Text style={styles.para}>
        Any intellectual property rights, and any other exclusive rights on software or technical
        applications embedded in or related to this Application are held by the Company and/or its
        licensors.
      </Text>
      <Text style={styles.para}>
        Subject to You the users' compliance with and notwithstanding any divergent provision of
        these Terms, the Company merely grants You a revocable, non-exclusive, non-sublicensable and
        non-transferable license to use the software and/or any other technical means embedded in
        the Service within the scope and for the purposes of this Application and the Service
        offered.
      </Text>
      <Text style={styles.para}>
        This license does not grant You any rights to access, usage, or disclosure of the original
        source code. All techniques, algorithms, and procedures contained in the software and any
        documentation thereto related is the Company's or its licensors' sole property.
      </Text>
      <Text style={styles.para}>
        Without prejudice to the above, under this license Users may download, install, use, and run
        the Application
      </Text>
      <Text style={styles.para}>
        The Company reserves the right to release updates, fixes, and further developments of this
        Application and/or its related software and to provide them to You. You may need to download
        and install such updates to continue using this Application.
      </Text>
      <Text style={styles.heading}>Copyright Policy</Text>
      <Text style={styles.subHeading}>Intellectual Property Infringement</Text>
      <Text style={styles.para}>
        We respect the intellectual property rights of others. It is Our policy to respond to any
        claim that Content posted on the Service infringes a copyright or other intellectual
        property infringement of any person.
      </Text>
      <Text style={styles.para}>
        If You are a copyright owner, or authorized on behalf of one, and You believe that the
        copyrighted work has been copied in a way that constitutes copyright infringement that is
        taking place through the Service, You must submit Your notice in writing to the attention of
        our copyright agent via email at support@thetaggid.com and include in Your notice a detailed
        description of the alleged infringement.
      </Text>
      <Text style={styles.para}>
        You may be held accountable for damages (including costs and attorneys' fees) for
        misrepresenting that any Content is infringing Your copyright.
      </Text>
      <Text style={styles.subHeading}>
        DMCA Notice and DMCA Procedure for Copyright Infringement Claims
      </Text>
      <Text style={styles.para}>
        You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by
        providing our Copyright Agent with the following information in writing (see 17 U.S.C
        512(c)(3) for further detail):
      </Text>
      {textWithBulletPoint(
        "An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest.",
        styles.para,
      )}
      {textWithBulletPoint(
        'A description of the copyrighted work that You claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work.',
        styles.para,
      )}
      {textWithBulletPoint(
        'Identification of the URL or other specific location on the Service where the material that You claim is infringing is located.',
        styles.para,
      )}
      {textWithBulletPoint('Your address, telephone number, and email address.', styles.para)}
      {textWithBulletPoint(
        'A statement by You that You have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.',
        styles.para,
      )}
      {textWithBulletPoint(
        "A statement by You, made under penalty of perjury, that the above information in Your notice is accurate and that You are the copyright owner or authorized to act on the copyright owner's behalf.",
        styles.para,
      )}
      <Text style={styles.para}>
        You can contact our copyright agent via email at support@tagg.id. Upon receipt of a
        notification, the Company will take whatever action, in its sole discretion, it deems
        appropriate, including removal of the challenged content from the Service.
      </Text>
      <Text style={styles.heading}>Intellectual Property</Text>
      <Text style={styles.para}>
        The Service and its original content (excluding Content provided by You or other users),
        features and functionality are and will remain the exclusive property of the Company and its
        licensors.
      </Text>
      <Text style={styles.para}>
        The Service is protected by copyright, trademark, and other laws of both the Country and
        foreign countries.
      </Text>
      <Text style={styles.para}>
        Our trademarks and trade dress may not be used in connection with any product or service
        without the prior written consent of the Company.
      </Text>
      <Text style={styles.heading}> Your Feedback to Us </Text>
      <Text style={styles.para}>
        You assign all rights, title and interest in any Feedback You provide the Company. If for
        any reason such assignment is ineffective, You agree to grant the Company a non-exclusive,
        perpetual, irrevocable, royalty free, worldwide right and licence to use, reproduce,
        disclose, sub-licence, distribute, modify and exploit such Feedback without restriction.
      </Text>
      <Text style={styles.heading}> Links to Other Websites </Text>
      <Text style={styles.para}>
        Our Service may contain links to third-party web sites or services that are not owned or
        controlled by the Company.
      </Text>
      <Text style={styles.para}>
        The Company has no control over, and assumes no responsibility for, the content, privacy
        policies, or practices of any third party web sites or services. You further acknowledge and
        agree that the Company shall not be responsible or liable, directly or indirectly, for any
        damage or loss caused or alleged to be caused by or in connection with the use of or
        reliance on any such content, goods or services available on or through any such web sites
        or services.
      </Text>
      <Text style={styles.para}>
        We strongly advise You to read the terms and conditions and privacy policies of any third-
        party web sites or services that You visit
      </Text>
      <Text style={styles.heading}> Termination </Text>
      <Text style={styles.para}>
        We may terminate or suspend Your Account immediately, without prior notice or liability, for
        any reason whatsoever, including without limitation if You breach these Terms of Service.
      </Text>
      <Text style={styles.para}>
        Upon termination, Your right to use the Service will cease immediately. If You wish to
        terminate Your Account,. You may simply discontinue using the Service.
      </Text>
      <Text style={styles.heading}>Limitation of Liability</Text>
      <Text style={styles.para}>
        Notwithstanding any damages that You might incur, the entire liability of the Company and
        any of its suppliers under any provision of this Terms and Your exclusive remedy for all of
        the foregoing shall be limited to the amount actually paid by You through the Service or 100
        USD if You haven't purchased anything through the Service.
      </Text>
      <Text style={styles.para}>
        To the maximum extent permitted by applicable law, in no event shall the Company or its
        suppliers be liable for any special, incidental, indirect, or consequential damages
        whatsoever (including, but not limited to, damages for loss of profits, loss of data or
        other information, for business interruption, for personal injury, loss of privacy arising
        out of or in any way related to the use of or inability to use the Service, third-party
        software and/or third-party hardware used with the Service, or otherwise in connection with
        any provision of this Terms), even if the Company or any supplier has been advised of the
        possibility of such damages and even if the remedy fails of its essential purpose.
      </Text>
      <Text style={styles.para}>
        Some states do not allow the exclusion of implied warranties or limitation of liability for
        incidental or consequential damages, which means that some of the above limitations may not
        apply. In these states, each party's liability will be limited to the greatest extent
        permitted by law.
      </Text>
      <Text style={styles.heading}>"AS IS" and "AS AVAILABLE" Disclaimer</Text>
      <Text style={styles.para}>
        The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects
        without warranty of any kind. To the maximum extent permitted under applicable law, the
        Company, on its own behalf and on behalf of its Affiliates and its and their respective
        licensors and service providers, expressly disclaims all warranties, whether express,
        implied, statutory or otherwise, with respect to the Service, including all implied
        warranties of merchantability, fitness for a particular purpose, title and non-infringement,
        and warranties that may arise out of course of dealing, course of performance, usage or
        trade practice. Without limitation to the foregoing, the Company provides no warranty or
        undertaking, and makes no representation of any kind that the Service will meet Your
        requirements, achieve any intended results, be compatible or work with any other software,
        applications, systems or services, operate without interruption, meet any performance or
        reliability standards or be error free or that any errors or defects can or will be
        corrected.
      </Text>
      <Text style={styles.para}>
        Without limiting the foregoing, neither the Company nor any of the company's provider makes
        any representation or warranty of any kind, express or implied: (i) as to the operation or
        availability of the Service, or the information, content, and materials or products included
        thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the
        accuracy, reliability, or currency of any information or content provided through the
        Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on
        behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs
        or other harmful components.
      </Text>
      <Text style={styles.para}>
        Some jurisdictions do not allow the exclusion of certain types of warranties or limitations
        on applicable statutory rights of a consumer, so some or all of the above exclusions and
        limitations may not apply to You. But in such a case the exclusions and limitations set
        forth in this section shall be applied to the greatest extent enforceable under applicable
        law.
      </Text>
      <Text style={styles.heading}>Governing Law </Text>
      <Text style={styles.para}>
        The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and
        Your use of the Service. Your use of the Application may also be subject to other local,
        state, national, or international laws.
      </Text>
      <Text style={styles.heading}>Disputes Resolution </Text>
      <Text style={styles.para}>
        If You have any concern or dispute about the Service, You agree to first try to resolve the
        dispute informally by contacting the Company.
      </Text>
      <Text style={styles.heading}>For European Union (EU) Users </Text>
      <Text style={styles.para}>
        If You are a European Union consumer, you will benefit from any mandatory provisions of the
        law of the country in which you are resident in.
      </Text>
      <Text style={styles.heading}>United States Legal Compliance </Text>
      <Text style={styles.para}>
        You represent and warrant that (i) You are not located in a country that is subject to the
        United States government embargo, or that has been designated by the United States
        government as a "terrorist supporting" country, and (ii) You are not listed on any United
        States government list of prohibited or restricted parties.
      </Text>
      <Text style={styles.heading}>Severability and Waiver</Text>
      <Text style={styles.subHeading}>Severability</Text>
      <Text style={styles.para}>
        If any provision of these Terms is held to be unenforceable or invalid, such provision will
        be changed and interpreted to accomplish the objectives of such provision to the greatest
        extent possible under applicable law and the remaining provisions will continue in full
        force and effect.
      </Text>
      <Text style={styles.subHeading}>Waiver</Text>
      <Text style={styles.para}>
        Except as provided herein, the failure to exercise a right or to require performance of an
        obligation under this Terms shall not effect a party's ability to exercise such right or
        require such performance at any time thereafter nor shall be the waiver of a breach
        constitute a waiver of any subsequent breach.
      </Text>
      <Text style={styles.heading}>Translation Interpretation</Text>
      <Text style={styles.para}>
        These Terms of Service may have been translated if We have made them available to You on our
        Service. You agree that the original English text shall prevail in the case of a dispute.
      </Text>
      <Text style={styles.heading}>Changes to These Terms of Service</Text>
      <Text style={styles.para}>
        We reserve the right, at Our sole discretion, to modify or replace these Terms at any time.
        If a revision is material We will make reasonable efforts to provide at least 30 days'
        notice prior to any new terms taking effect. What constitutes a material change will be
        determined at Our sole discretion.
      </Text>
      <Text style={styles.para}>
        By continuing to access or use Our Service after those revisions become effective, You agree
        to be bound by the revised terms. If You do not agree to the new terms, in whole or in part,
        please stop using the website and the Service.
      </Text>
      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.para}>
        If you have any questions about these Terms of Service, You can contact us:
      </Text>
      <Text style={styles.paraLeftAlign}>
        By email: <Text style={styles.link}>support@tagg.id</Text>
      </Text>
      <Text style={styles.paraLeftAlign}>
        By visiting this page on our{' '}
        <Text
          style={styles.link}
          onPress={() => {
            Linking.openURL(TAGG_WEBSITE + 'terms-and-conditions/');
          }}>
          website
        </Text>
      </Text>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  para: {
    textAlign: 'justify',
    padding: 5,
  },
  paraLeftAlign: {
    paddingTop: 5,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  paddingTopLow: {
    paddingTop: 5,
  },
  heading: {
    paddingTop: 8,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'left',
  },
  subHeading: {
    paddingTop: 5,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
    paddingTop: 5,
  },
  link: {
    color: 'blue',
  },
  unbold: {
    fontWeight: 'normal',
  },
});

export default TermsAndConditionsText;
