create TABLE users(
    id SERIAL PRIMARY KEY,
    id_client VARCHAR(20) NOT NULL,
    name VARCHAR(255),
    regNumber VARCHAR(20),
    account VARCHAR(50),
    bank VARCHAR(255),
    iban VARCHAR(255),
    swift VARCHAR(255),
    login VARCHAR(50),
    pass VARCHAR(50)
    
);
create TABLE agreements(
    id SERIAL PRIMARY KEY,
    id_client VARCHAR(20) NOT NULL,
    signed BOOLEAN,
    regular_fee NUMERIC(2),
    cheking_days INTEGER,
    high_priority NUMERIC(2),
    midle_priority NUMERIC(2),
    low_priority NUMERIC(2),
    manager VARCHAR(255),
    id_user INTEGER,
    FOREIGN KEY (id_user) REFERENCES users (id)
);
create TABLE tasks(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    id_client VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    created timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    registred timestamptz,
    progres timestamptz,
    cheking timestamptz,
    apruved timestamptz,
    canceled timestamptz,
    closed timestamptz,
    estime NUMERIC(2),
    id_tiket VARCHAR(20) NOT NULL,    
    id_user INTEGER,
    FOREIGN KEY (id_user) REFERENCES users (id)
);
create TABLE files(
    id SERIAL PRIMARY KEY,
    file VARCHAR(255) NOT NULL, 
    name  VARCHAR(255) NOT NULL,
    type  VARCHAR(20) NOT NULL,
    size  INTEGER,
    id_file VARCHAR (20) NOT NULL, 
    id_tiket VARCHAR(20) NOT NULL,  
    id_task  INTEGER,  
    FOREIGN KEY (id_task) REFERENCES tasks (id)
);
create TABLE instructions(
    id SERIAL PRIMARY KEY,
    file VARCHAR(255) NOT NULL, 
    name  VARCHAR(255) NOT NULL,
    type  VARCHAR(20) NOT NULL,
    size  INTEGER,
    id_file VARCHAR (20) NOT NULL, 
    id_tiket VARCHAR(20) NOT NULL, 
    id_client VARCHAR(20) NOT NULL,   
    id_task  INTEGER, 
    id_user INTEGER,
    FOREIGN KEY (id_user) REFERENCES users (id),     
    FOREIGN KEY (id_task) REFERENCES tasks (id)    
);

create TABLE bills(
    id SERIAL PRIMARY KEY,
    file VARCHAR(255) NOT NULL, 
    name  VARCHAR(255) NOT NULL,
    type  VARCHAR(20) NOT NULL, 
    period timestamp NOT NULL, 
    id_file VARCHAR (20) NOT NULL, 
    id_client VARCHAR(20) NOT NULL,  
    id_agreement  INTEGER NOT NULL,   
    FOREIGN KEY (id_agreement) REFERENCES agreements (id)
);

//  очередь
SELECT  
CASE WHEN id_client ='Mobs_00000000009'  THEN title ELSE 'Задача' end  as title,
CASE WHEN id_client ='Mobs_00000000009'  THEN priority ELSE 'Задача'end  as priority,
CASE WHEN id_client ='Mobs_00000000009'  THEN content ELSE '-' end  as content,
estime,
coalesce(sum(estime) over (order by created 
                rows between unbounded preceding and current row), 
                0) as total,
id_tiket
FROM tasks 
WHERE (status ='registered' OR status ='processing') 
ORDER BY priority, registred
