  (function(){
    var G=[
      ["No Poverty","End poverty in all its forms everywhere","#E5243B","Goal 1 aims to end poverty everywhere, looking beyond income to access to health care, food, education and decent work.","Poverty eradication"],
      ["Zero Hunger","End hunger, achieve food security and improved nutrition and promote sustainable agriculture","#DDA63A","Goal 2 seeks to end hunger, secure good nutrition for everyone and support farming that sustains both people and land.","Food security and nutrition"],
      ["Good Health and Well-being","Ensure healthy lives and promote well-being for all at all ages","#4C9F38","Goal 3 works toward healthy lives and well-being for people of all ages, from primary care to protection against disease.","Health and well-being"],
      ["Quality Education","Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all","#C5192D","Goal 4 promotes inclusive, quality education and learning opportunities that last a lifetime.","Lifelong learning"],
      ["Gender Equality","Achieve gender equality and empower all women and girls","#FF3A21","Goal 5 pushes for equal rights and opportunities for women and girls at home, at work and in public life.","Women’s empowerment"],
      ["Clean Water and Sanitation","Ensure availability and sustainable management of water and sanitation for all","#26BDE2","Goal 6 aims for safe drinking water, sanitation and well-managed water resources for everyone.","Safe water and sanitation"],
      ["Affordable and Clean Energy","Ensure access to affordable, reliable, sustainable and modern energy for all","#FCC30B","Goal 7 calls for reliable, affordable and clean energy that reaches every household and business.","Clean and modern energy"],
      ["Decent Work and Economic Growth","Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all","#A21942","Goal 8 supports steady, inclusive economic growth and productive, decent jobs for all.","Decent work and growth"],
      ["Industry, Innovation and Infrastructure","Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation","#FD6925","Goal 9 focuses on resilient infrastructure and inclusive industry and innovation that widen opportunity.","Innovation and infrastructure"],
      ["Reduced Inequalities","Reduce inequality within and among countries","#DD1367","Goal 10 works to narrow gaps in income, opportunity and treatment within and between countries.","Inclusion and equity"],
      ["Sustainable Cities and Communities","Make cities and human settlements inclusive, safe, resilient and sustainable","#FD9D24","Goal 11 aims to make cities and communities safe, inclusive, resilient and sustainable.","Resilient communities"],
      ["Responsible Consumption and Production","Ensure sustainable consumption and production patterns","#BF8B2E","Goal 12 encourages wiser use of resources and less waste in how we produce and consume.","Sustainable consumption"],
      ["Climate Action","Take urgent action to combat climate change and its impacts","#3F7E44","Goal 13 calls for urgent action on climate change and for helping communities cope with its effects.","Climate adaptation"],
      ["Life Below Water","Conserve and sustainably use the oceans, seas and marine resources for sustainable development","#0A97D9","Goal 14 seeks to protect oceans, seas and marine life and to use their resources sustainably.","Marine conservation"],
      ["Life on Land","Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss","#56C02B","Goal 15 aims to protect forests and land ecosystems, restore degraded land and halt biodiversity loss.","Forests and biodiversity"],
      ["Peace, Justice and Strong Institutions","Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels","#00689D","Goal 16 promotes peaceful, inclusive societies, access to justice and accountable institutions.","Justice and strong institutions"],
      ["Partnerships for the Goals","Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development","#19486A","Goal 17 builds the partnerships and resources needed to deliver every other goal.","Global partnerships"]
    ];

    var E=[
      {d:"03",m:"OCT 2026",t:"Project RELIEF: Let It Out, Lift It Up! — Student Resilience & Mental Wellness Program",r:"Sat 12 Sep - Sat 03 Oct 2026",topic:"Research Utilization (CoCJE)",g:[3,4,16],id:"event-project-relief-wellness"},
      {d:"17",m:"SEP 2026",t:"Strengthening Data Skills for Better Health Research",r:"Thu 17 - Fri 18 Sep 2026",topic:"Professional Development",g:[3,4,9,17],id:"event-data-skills"},
      {d:"17",m:"SEP 2026",t:"Pharmacy Research with Purpose: Every Study, a Goal and an Impact",r:"Thu 17 - Fri 18 Sep 2026",topic:"BS Pharmacy",g:[4,9,16,17],id:"event-pharmacy-research"},
      {d:"16",m:"SEP 2026",t:"From Problems to Purpose: Strengthening Research Capacity",r:"Wed 16 Sep 2026",topic:"General Education Department",g:[4,9,16,17],id:"event-problems-to-purpose"},
      {d:"16",m:"SEP 2026",t:"Leading Through Inquiry, Improving Through Evidence",r:"Wed 16 Sep 2026",topic:"Academic Heads",g:[4,9,17],id:"event-leading-through-inquiry"},
      {d:"15",m:"SEP 2026",t:"From Numbers to Narratives: Making Data Meaningful",r:"Tue 15 Sep 2026",topic:"Data Appreciation",g:[4,9,16,17],id:"event-numbers-to-narratives"},
      {d:"09",m:"SEP 2026",t:"Research Leadership in Action",r:"Wed 09 Sep 2026",topic:"Academic Heads",g:[4,9,17],id:"event-research-leadership"},
      {d:"09",m:"SEP 2026",t:"From Innovation to Opportunity: Advancing Ideas for Possible Funding",r:"Wed 09 - Fri 11 Sep 2026",topic:"Cagayan Valley STI Week",g:[2,3,4,9,17],id:"event-innovation-to-opportunity"},
      {d:"09",m:"SEP 2026",t:"Research That Sees Everyone: Advancing Knowledge through a Gender-Responsive Lens",r:"Wed 09 - Thu 10 Sep 2026",topic:"Regional Seminar-Training",g:[4,5,9,17],id:"event-research-sees-everyone"},
      {d:"28",m:"AUG 2026",t:"From Samples to Statistics: Turning Data into Meaningful Discoveries",r:"Fri 28 Aug 2026",topic:"High School Research Summit — Episode 2",g:[4,9,17],id:"event-samples-to-statistics"},
      {d:"28",m:"AUG 2026",t:"Pick a Goal. Raise Your Flag. Make Your Impact.",r:"Fri 28 Aug 2026",topic:"Research for the Goals",g:[4,9,16,17],id:"event-sdg-spot-launch"},
      {d:"—",m:"SDG SPOT @ RDC",t:"Every Study. A Goal. An Impact. (BS Tourism Management)",r:"SDG Research Snap, one of the activities under SDG SPOT @ RDC",topic:"BS Tourism Management",g:[4,9,16,17],id:"event-sdg-research-snap-tourism"},
      {d:"24",m:"AUG 2026",t:"Equipping Students for Meaningful Community Engagement",r:"Mon 24 Aug 2026",topic:"Community Extension Services",g:[4,16,17],id:"event-equipping-students"},
      {d:"24",m:"AUG 2026",t:"Strengthening Research Through Shared Direction",r:"Mon 24 Aug 2026",topic:"MCNP–ISAP RDC",g:[4,9,16,17],id:"event-general-assembly"},
      {d:"19",m:"AUG 2026",t:"Advancing Health Research Through Collaboration",r:"Wed 19 - Thu 20 Aug 2026",topic:"RRF Technical Review",g:[4,17],id:"event-health-research-collaboration"},
      {d:"07",m:"AUG 2026",t:"Research for Sustainable Impact",r:"Fri 07 Aug 2026",topic:"ISAP-K Conference",g:[4,9,11,17],id:"event-icir-2026"},
      {d:"17",m:"NOV 2024",t:"RDC Joins CBCP-UST Collaborative Project on Catholic Christianity",r:"Sun 17 Nov 2024",topic:"Catholic Christianity Study",g:[4,16,17],id:"event-cbcp-ust-collab"},
      {d:"—",m:"2024",t:"MCNP and ISAP Students Excel in the 28th Philippine Statistics Quiz Bee",r:"28th Philippine Statistics Quiz Bee",topic:"Statistics Quiz Bee",g:[4,9,17],id:"event-student-stats-28th"},
      {d:"—",m:"35th NSM",t:"Congratulations to the Winners of the Institutional Statistics Quiz Bee",r:"35th National Statistics Month",topic:"Quiz Bee Winners",g:[4,9,17],id:"event-inst-quiz-bee"},
      {d:"08",m:"OCT 2024",t:"Research Director Ryan C. Fontanilla and IT Dean Engr. Myke Albert Tejada Participate in Collaborative Study",r:"Tue 08 Oct 2024",topic:"Research Collaboration",g:[4,16,17],id:"event-fontanilla-tejada-collab"},
      {d:"03",m:"OCT 2024",t:"Region 2 Emerges as Overall Champion",r:"Thu 03 - Fri 04 Oct 2024",topic:"RDaFest 2024",g:[4,9,17],id:"event-rdafest-champion-2024"},
      {d:"04",m:"OCT 2024",t:"School Statisticians Join the 35th National Statistics Month Color Fun Run",r:"Fri 04 Oct 2024",topic:"Color Fun Run",g:[3,4,17],id:"event-stats-color-fun-run"},
      {d:"—",m:"OCT 2024",t:"MCNP and ISAP Students Receive Statistics Month Awards",r:"October 2024",topic:"Student Awards",g:[4,9,17],id:"event-student-stats-awards"},
      {d:"03",m:"OCT 2024",t:"Wendy Mae G. Lapus Represents ISAP at Regional Data Festival",r:"Thu 03 - Fri 04 Oct 2024",topic:"Research Presentation",g:[4,8,9,17],id:"event-lapus-rdafest-2024"},
      {d:"—",m:"SEP 2024",t:"MCNP and ISAP Conduct Digital Infographics Making Contest",r:"September 2024",topic:"Digital Infographics",g:[4,9,17],id:"event-infographics-contest"}
    ];

    var common="The MCNP &amp; ISAP Research &amp; Development Center brings this goal into its research and community extension work in Cagayan Valley, turning academic, clinical and legal expertise into support for the communities that need it most.";

    function $(id){ return document.getElementById(id); }
    function pad(n){ return (n < 10 ? '0' : '') + n; }
    function badge(n){
      var num = pad(n);
      var title = (G[n - 1] && G[n - 1][0]) ? ('SDG ' + n + ': ' + G[n - 1][0]) : ('SDG ' + n);
      return '<span class="un-badge-icon" title="' + title + '">' +
        '<img src="assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-' + num + '.png" alt="' + title + '" loading="lazy" decoding="async">' +
      '</span>';
    }
    function eventUrl(item){ return "news-events.html#" + item.id; }

    // Render Goal Selector Bar
    $("un-goalbar").firstElementChild.innerHTML = G.map(function(goal, i){
      var gNum = i + 1;
      return '<a href="?goal=' + gNum + '" data-goal="' + gNum + '" style="--c:' + goal[2] + '" aria-label="Goal ' + gNum + ': ' + goal[0] + '">' + gNum + '</a>';
    }).join("");

    function show(n, smoothScroll){
      var goal = G[n - 1];
      if (!goal) return;
      var nextGoal = n === 17 ? 1 : n + 1;
      var prevGoal = n === 1 ? 17 : n - 1;

      // Update Theme CSS Variable & Badges
      $("un-page").style.setProperty("--goal", goal[2]);
      $("sdg-top-badge").style.background = goal[2];
      $("sdg-top-badge").textContent = "SDG " + n + " Active";
      $("sdg-top-name").textContent = goal[0];
      $("un-breadcrumb-curr").textContent = "Goal " + n + ": " + goal[0];

      // Update Hero Icon
      $("un-hero-icon").src = "assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-" + pad(n) + ".png";
      $("un-hero-icon").alt = "SDG " + n + ": " + goal[0];

      $("un-num").textContent = n;
      $("un-title").textContent = goal[1];

      // Pagers
      var nextLink = $("un-next");
      nextLink.dataset.goal = String(nextGoal);
      nextLink.href = "?goal=" + nextGoal;
      nextLink.innerHTML = "Goal " + nextGoal + " ";

      var prevLink = $("un-prev");
      prevLink.dataset.goal = String(prevGoal);
      prevLink.href = "?goal=" + prevGoal;
      prevLink.innerHTML = " Goal " + prevGoal;

      // Overview
      $("un-ov").innerHTML = '<p style="font-weight: 500; font-size: 1.15rem; color: #0f172a; margin-bottom: 1.25rem;">' + goal[3] + '</p><p>' + common + '</p>';

      // Filter events & topics
      var list = E.filter(function(item){ return item.g.indexOf(n) > -1; });
      if ($("un-ev-count-badge")) {
        $("un-ev-count-badge").textContent = list.length + (list.length === 1 ? " Event" : " Events");
      }

      $("un-topic").innerHTML = list.length ? list.map(function(item){
        return '<li><a href="' + eventUrl(item) + '"><span class="un-related-date">' + item.topic + '</span><span class="un-related-title">' + item.t + '</span></a></li>';
      }).join("") : '<li><p class="un-related-empty">No related stories are tagged with this goal yet. <a href="news-events.html">Browse all news &amp; events </a></p></li>';

      $("un-events").innerHTML = list.length ? list.map(function(item){
        return '<a class="un-ev" href="' + eventUrl(item) + '"><div class="un-day">' + item.d + '</div><div class="un-mon">' + item.m + '</div>' + (item.topic ? '<div class="un-ev-topic">' + item.topic + '</div>' : '') + '<h3>' + item.t + '</h3><div class="un-range">' + item.r + '</div><div class="un-ev-link">Read full story </div><div class="un-ev-goals"><small>Related Goals</small><div class="un-ev-goals-strip">' + item.g.map(badge).join("") + '</div></div></a>';
      }).join("") : '<p class="un-empty">No events are listed for this goal yet. <a href="news-events.html">Browse all events </a></p>';

      // Update Active state in goalbar
      Array.prototype.forEach.call($("un-goalbar").querySelectorAll("a"), function(link){
        if (Number(link.dataset.goal) === n) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });

      document.title = "SDG " + n + ": " + goal[0] + " | SDG Overview | MCNP & ISAP RDC";

      if (smoothScroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    function fromUrl(){
      var q = parseInt(new URLSearchParams(location.search).get("goal"), 10);
      return q >= 1 && q <= 17 ? q : 1;
    }

    document.addEventListener("click", function(e){
      var link = e.target.closest("[data-goal]");
      if (!link) return;
      e.preventDefault();
      var n = Number(link.dataset.goal);
      history.pushState(null, "", "?goal=" + n);
      show(n, true);
    });

    window.addEventListener("popstate", function(){
      show(fromUrl(), false);
    });

    show(fromUrl(), false);
  })();
