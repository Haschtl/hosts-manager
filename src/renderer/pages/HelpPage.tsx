/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { NavPageContainer, Accordion } from 'react-windows-ui';

import { State } from '../store/types';
import './HelpPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const HelpPage: React.FC<Props> = () => {
  return (
    <NavPageContainer animateTransition>
      <div className="page help">
        <h1>Help</h1>
        <p>This Q&A may help you with frequent problems.</p>
        <h3>DNS</h3>
        {/* @ts-ignore */}
        <Accordion headerTitle="What is DNS?" style={{ width: '100%' }}>
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              DNS stands for Domain Name System and it is a decentralized system
              for translating domain names (e.g. www.google.com) into IP
              addresses.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        {/* @ts-ignore */}
        <Accordion headerTitle="Why do we need DNS?" style={{ width: '100%' }}>
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              We need DNS because it makes it easier for us to remember website
              addresses using domain names instead of having to remember the
              numerical IP addresses.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="What are the main components of DNS?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              The main components of DNS are name servers, zones, records, and
              resolvers.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="What is a name server in DNS?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              A name server in DNS is a server that contains the mapping between
              domain names and IP addresses and is responsible for answering DNS
              queries.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="What is a DNS resolver?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              A DNS resolver is a client-side component that sends DNS queries
              to name servers and receives responses in order to resolve domain
              names to IP addresses.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="What is a DNS record?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              A DNS record is a database entry that contains information such as
              the IP address, mail server, and other details about a domain
              name.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        {/* @ts-ignore */}
        <Accordion headerTitle="What is a DNS zone?" style={{ width: '100%' }}>
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              A DNS zone is a portion of the DNS namespace that is managed by a
              specific entity and contains a set of DNS records.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        {/* @ts-ignore */}
        <Accordion headerTitle="What is a DNS cache?" style={{ width: '100%' }}>
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              A DNS cache is a temporary storage of DNS records maintained by a
              computer or a network device to speed up the resolution process.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <h3>hosts file</h3>
        <Accordion
          headerTitle="What is a hosts file?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              The hosts file is a plain text file that maps hostnames to IP
              addresses, used by operating systems to resolve domain names to IP
              addresses.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="Where is the hosts file located?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              The location of the hosts file varies by operating system. For
              example, in Windows, it is located at
              C:\Windows\System32\drivers\etc\hosts while in Linux, it is
              located at /etc/hosts.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="What is the purpose of the hosts file?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              The hosts file is used to override the DNS resolution of a domain
              name to a specific IP address, for example for testing purposes,
              to block malicious domains, or to improve performance.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="How does the hosts file work?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              The hosts file works by mapping a domain name to a specific IP
              address. When a computer receives a request for a domain name, it
              checks the hosts file first before sending a request to the DNS
              system. If the domain name is found in the hosts file, it returns
              the IP address associated with it.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="Can I edit the hosts file on my computer?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              Yes, you can edit the hosts file on your computer by using a text
              editor, such as Notepad, as long as you have administrator
              privileges.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="What happens if I have multiple entries for the same domain in the hosts file?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              The first entry in the hosts file will be used. If there are
              multiple entries, only the first one will be considered, and the
              rest will be ignored.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="Can the hosts file be used for malicious purposes?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              Yes, the hosts file can be used for malicious purposes if it is
              modified to redirect traffic from legitimate websites to phishing
              or malware-infected websites. That is why it is important to keep
              the hosts file secure and only make changes to it when necessary.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <h3>Hosts-based ad blocker</h3>
        <Accordion
          headerTitle="What is an ad blocker?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              An ad blocker is a software program or browser extension that
              blocks advertisements from being displayed on a web page.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="How does an ad blocker based on the hosts file work?
"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              An ad blocker based on the hosts file works by redirecting domain
              names used by ad servers to a local IP address (e.g. 127.0.0.1)
              which is the address for the localhost. This effectively blocks
              the ads from being displayed as the ad server&apos;s domain name
              cannot be resolved to an IP address.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="Are all ad blockers based on the hosts file?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              No, not all ad blockers are based on the hosts file. There are
              other methods, such as using browser extensions or proxying, that
              can also be used to block advertisements.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="Are ad blockers based on the hosts file effective?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              Ad blockers based on the hosts file can be effective, but they may
              not be as comprehensive as other methods. This is because the
              hosts file only blocks ads from a pre-defined list of ad servers,
              while other methods can dynamically block ads in real-time.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="Can ad servers change their domains to bypass ad blockers based on the hosts file?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              Yes, ad servers can change their domains to bypass ad blockers
              based on the hosts file. However, this is a cat-and-mouse game, as
              the lists of domains used by ad servers are often updated by the
              ad blocker community to ensure that the ad blockers remain
              effective.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="Are there any benefits to using an ad blocker based on the hosts file?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              <p>
                <b>Customizability</b>: Ad blockers based on the hosts file can
                be customized to block only specific ads or to block all ads.
                This is done by adding or removing entries in the hosts file.
              </p>
              <p>
                <b>Open-source nature</b>: The hosts file method is open-source,
                meaning that the lists of domains used by ad servers can be
                easily shared and updated by the community.
              </p>
              <p>
                <b>Easy to use</b>: Ad blockers based on the hosts file are
                usually easy to use, as they simply require adding entries to
                the hosts file. No special software or browser extensions are
                needed.
              </p>
              <p>
                <b>Cross-platform</b>: Ad blockers based on the hosts file can
                be used on any operating system that supports a hosts file,
                making it a cross-platform solution.
              </p>
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
        <Accordion
          headerTitle="Are there any drawbacks to using an ad blocker based on the hosts file?"
          // @ts-ignore
          style={{ width: '100%' }}
        >
          {/* @ts-ignore */}
          <Accordion.Panel>
            <p>
              One drawback of using an ad blocker based on the hosts file is
              that it may slow down the performance of your computer, as the
              hosts file must be checked for each domain name resolution.
              Additionally, using a large hosts file can also consume a
              significant amount of memory. Another drawback is that some
              websites may not function properly if certain ads are blocked, as
              they may rely on those ads for revenue.
            </p>
            {/* @ts-ignore */}
          </Accordion.Panel>
        </Accordion>
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { active: state.app.active };
};
export default connect(mapStateToProps, mapDispatchToProps)(HelpPage);
